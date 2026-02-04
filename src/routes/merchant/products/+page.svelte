<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import { fade, scale } from 'svelte/transition';
    import { userState } from '$lib/stores/user.svelte';

    // State Data
    let products = $state<any[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state('');

    // State untuk Modal Panduan
    let showGuide = $state(false);

    // Derived State untuk pencarian
    let filteredProducts = $derived(
        products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    onMount(async () => {
        // --- HOOK OTOMATIS (Produk) ---
        // Cek apakah user pernah melihat panduan halaman produk
        const hasSeenGuide = localStorage.getItem('products_guide_seen_v1');
        
        if (!hasSeenGuide) {
            setTimeout(() => {
                showGuide = true;
                localStorage.setItem('products_guide_seen_v1', 'true');
            }, 1000);
        }
        // -----------------------------

        try {
            const res = await api('/products');
            products = res.data || res; // Handle jika response dibungkus 'data' atau array langsung
        } catch (e) {
            console.error("Gagal memuat produk", e);
        } finally {
            isLoading = false;
        }
    });

    async function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Semua Batch QR terkait mungkin akan menjadi tidak valid.')) return;

        try {
            await api(`/products/${id}`, { method: 'DELETE' });
            products = products.filter(p => p.id !== id);
        } catch (e) {
            alert('Gagal menghapus produk. Pastikan tidak ada Batch aktif yang menggunakan produk ini.');
        }
    }
</script>

<svelte:head>
    <title>Kelola Produk - {userState.user?.name || 'Merchant'}</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Produk Anda</h1>
            <p class="text-slate-500 text-sm mt-1">Kelola daftar barang yang akan dilindungi.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
             <button 
                onclick={() => showGuide = true}
                class="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition shadow-sm"
            >
                <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan
            </button>

            <div class="relative">
                <input 
                    type="text" 
                    bind:value={searchQuery}
                    placeholder="Cari nama / SKU..." 
                    class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent w-full sm:w-64"
                />
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <a href="/merchant/products/new" class="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-slate-900/20">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Tambah Produk
            </a>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {#if isLoading}
            <div class="flex-1 flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        {:else if filteredProducts.length === 0}
            <div class="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <h3 class="text-lg font-medium text-slate-900">Belum ada produk</h3>
                <p class="text-slate-500 max-w-sm mt-2 mb-6">Tambahkan produk pertama Anda untuk mulai membuat Batch QR Code.</p>
                {#if searchQuery}
                    <button onclick={() => searchQuery = ''} class="text-brand-600 hover:text-brand-700 font-medium">Bersihkan pencarian</button>
                {:else}
                    <a href="/merchant/products/new" class="text-brand-600 hover:text-brand-700 font-medium">Buat Produk Baru &rarr;</a>
                {/if}
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th class="px-6 py-4">Info Produk</th>
                            <th class="px-6 py-4">SKU</th>
                            <th class="px-6 py-4">Dibuat</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        {#each filteredProducts as product (product.id)}
                            <tr class="hover:bg-slate-50/50 transition">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        {#if product.image_url}
                                            <img src={product.image_url} alt={product.name} class="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                                        {:else}
                                            <div class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                            </div>
                                        {/if}
                                        <div>
                                            <div class="font-semibold text-slate-900">{product.name}</div>
                                            <div class="text-xs text-slate-500 truncate max-w-[200px]">{product.description || '-'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                        {product.sku}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-slate-500">
                                    {new Date(product.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <a href={`/merchant/products/${product.id}`} class="text-brand-600 hover:text-brand-800 font-medium text-xs transition">Edit</a>
                                    <span class="text-slate-300">|</span>
                                    <button onclick={() => handleDelete(product.id)} class="text-red-500 hover:text-red-700 font-medium text-xs transition">Hapus</button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

{#if showGuide}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick={() => showGuide = false}></div>
        
        <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" transition:scale={{ start: 0.95, duration: 200 }}>
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Panduan Manajemen Produk
                </h2>
                <button onclick={() => showGuide = false} class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
                
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div class="text-blue-600 shrink-0 mt-0.5">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-blue-900 mb-1">Langkah Pertama!</h3>
                        <p class="text-blue-700 leading-relaxed">
                            Sebelum Anda bisa membuat QR Code, Anda <strong>wajib</strong> mendaftarkan produk di halaman ini. Produk ini akan menjadi "Induk" dari ribuan kode QR yang nantinya Anda cetak.
                        </p>
                    </div>
                </div>

                <div class="space-y-3">
                    <h3 class="font-bold text-slate-900 text-base">Apa itu SKU?</h3>
                    <p>
                        <strong>SKU (Stock Keeping Unit)</strong> adalah kode unik untuk setiap jenis barang Anda (misal: "KAOS-HITAM-L" atau "SRM-WJH-01").
                    </p>
                    <ul class="list-disc list-outside pl-4 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <li>Sistem akan menolak jika Anda memasukkan SKU yang sama dua kali.</li>
                        <li>SKU membantu Anda melacak performa produk spesifik di Dashboard.</li>
                    </ul>
                </div>

                <div class="space-y-3">
                    <h3 class="font-bold text-slate-900 text-base">Tips Foto Produk</h3>
                    <p>
                        Saat konsumen memindai QR Code, hal pertama yang mereka lihat adalah <strong>Foto Produk</strong> ini. Pastikan foto:
                    </p>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg text-xs font-medium">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            Jelas & Terang
                        </div>
                        <div class="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg text-xs font-medium">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            Sesuai Kemasan Asli
                        </div>
                    </div>
                </div>

            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
                <button onclick={() => showGuide = false} class="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                    Saya Mengerti
                </button>
            </div>
        </div>
    </div>
{/if}
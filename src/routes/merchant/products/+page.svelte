<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { api } from '$lib/services/api';

    // --- State Management (Svelte 5 Runes) ---
    let products = $state<any[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state('');
    let isDeleting = $state<string | null>(null); // Menyimpan ID produk yang sedang dihapus

    // --- Fetch Data ---
    onMount(async () => {
        try {
            const res = await api('/products');
            products = res.data || res; 
        } catch (e) {
            console.error(e);
            alert('Gagal memuat daftar produk.');
        } finally {
            isLoading = false;
        }
    });

    // --- Computed: Filter Pencarian ---
    // Menggunakan $derived untuk reaktivitas otomatis saat searchQuery berubah
    let filteredProducts = $derived(
        products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // --- Action: Hapus Produk ---
    async function handleDelete(id: string, name: string) {
        if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
            return;
        }

        isDeleting = id; // Set loading state untuk baris ini

        try {
            await api(`/products/${id}`, { method: 'DELETE' });
            
            // Hapus dari state lokal agar tidak perlu refresh halaman
            products = products.filter(p => p.id !== id);
        } catch (e) {
            console.error(e);
            alert('Gagal menghapus produk. Silakan coba lagi.');
        } finally {
            isDeleting = null;
        }
    }
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Katalog Produk</h1>
            <p class="text-gray-500 mt-1 text-sm">Kelola semua produk dan stok Anda di sini.</p>
        </div>
        
        <div class="flex gap-3">
            <div class="relative group">
                <input 
                    type="text" 
                    bind:value={searchQuery}
                    placeholder="Cari nama atau SKU..." 
                    class="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64 transition-all shadow-sm group-hover:border-gray-400"
                >
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <a 
                href="/merchant/products/new" 
                class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-200 active:scale-95"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                <span class="hidden sm:inline">Tambah Produk</span>
            </a>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {#if isLoading}
            <div class="p-8 space-y-4 animate-pulse">
                {#each Array(5) as _}
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div class="h-4 bg-gray-200 rounded w-48"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                {/each}
            </div>
        {:else if filteredProducts.length === 0}
            <div class="flex flex-col items-center justify-center p-16 text-center">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                </div>
                {#if searchQuery}
                    <p class="text-gray-900 font-medium">Produk tidak ditemukan</p>
                    <p class="text-gray-500 text-sm mt-1">Coba kata kunci lain untuk "{searchQuery}"</p>
                {:else}
                    <h3 class="text-gray-900 font-medium text-lg">Belum ada produk</h3>
                    <p class="text-gray-500 text-sm mt-1 mb-6">Mulai tambahkan produk pertama Anda untuk ditampilkan di katalog.</p>
                    <a href="/merchant/products/new" class="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
                        Buat produk baru &rarr;
                    </a>
                {/if}
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-200">
                            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk Info</th>
                            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each filteredProducts as product (product.id)}
                            <tr class="group hover:bg-gray-50 transition-colors" transition:fade>
                                
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="flex-shrink-0 h-12 w-12 rounded-lg border border-gray-200 overflow-hidden bg-white">
                                            {#if product.image_url}
                                                <img 
                                                    src={product.image_url} 
                                                    alt={product.name} 
                                                    class="h-full w-full object-cover"
                                                >
                                            {:else}
                                                <div class="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                            {/if}
                                        </div>
                                        <div>
                                            <div class="font-semibold text-gray-900">{product.name}</div>
                                            <div class="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">
                                                {product.description || 'Tidak ada deskripsi'}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                        {product.sku}
                                    </span>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if product.active}
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            <span class="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                                            Aktif
                                        </span>
                                    {:else}
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            <span class="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
                                            Non-aktif
                                        </span>
                                    {/if}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center justify-end gap-2">
                                        <a 
                                            href={`/merchant/products/${product.id}`} 
                                            class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Produk"
                                        >
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>

                                        <button 
                                            onclick={() => handleDelete(product.id, product.name)}
                                            disabled={isDeleting === product.id}
                                            class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Hapus Produk"
                                        >
                                            {#if isDeleting === product.id}
                                                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            {:else}
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            {/if}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
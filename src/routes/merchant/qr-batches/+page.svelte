<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import { fade, scale } from 'svelte/transition';
    import { userState } from '$lib/stores/user.svelte';

    // State Data
    let batches = $state<any[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state('');
    
    // State untuk Modal Panduan
    let showGuide = $state(false);

    // --- FILTER & PENCARIAN (VERSI FIX) ---
    // Menggunakan logika 'safe access' agar tidak error jika data null
    let filteredBatches = $derived(
        batches.filter(b => {
            // Ambil nama batch (prioritas batch_name, fallback ke batch_number)
            const name = (b.batch_name || b.batch_number || '').toString().toLowerCase();
            // Ambil nama produk (prioritas product_name string, fallback ke object product.name)
            const product = (b.product_name || b.product?.name || '').toString().toLowerCase();
            const query = searchQuery.toLowerCase();
            
            return name.includes(query) || product.includes(query);
        })
    );

    onMount(async () => {
        // --- HOOK OTOMATIS: Tampilkan Panduan untuk User Baru ---
        const hasSeenGuide = localStorage.getItem('batches_guide_seen_v1');
        
        if (!hasSeenGuide) {
            setTimeout(() => {
                showGuide = true;
                localStorage.setItem('batches_guide_seen_v1', 'true');
            }, 1000);
        }
        // --------------------------------------------------------

        try {
            const res = await api('/qr-batches');
            batches = res.data || res;
        } catch (e) {
            console.error("Gagal memuat batch", e);
        } finally {
            isLoading = false;
        }
    });

    // Helper: Format Tanggal
    function formatDate(dateString: string) {
        if(!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    // Helper: Parse Metadata
    function getMetaInfo(batch: any) {
        const meta = batch.metadata_sample;
        if (!meta) return null;

        // Parse jika masih string JSON
        let data = meta;
        if (typeof meta === 'string') {
            try { data = JSON.parse(meta); } catch(e) { return null; }
        }
        
        return {
            date: data.production_date ? formatDate(data.production_date) : null,
            note: data.note || null,
            isCsv: !data.production_date && !data.note && Object.keys(data).length > 0
        };
    }
</script>

<svelte:head>
    <title>Riwayat Batch QR - {userState.user?.name || 'Merchant'}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease-out]">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Riwayat Batch QR</h1>
            <p class="text-gray-500 mt-1 text-sm">Kelola semua batch produksi dan kode QR yang telah digenerate.</p>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
             <button 
                onclick={() => showGuide = true}
                class="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition shadow-sm"
            >
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan
            </button>

            <div class="relative group flex-grow md:flex-grow-0">
                <input 
                    type="text" 
                    bind:value={searchQuery} 
                    placeholder="Cari nama batch..." 
                    class="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64 transition-all shadow-sm group-hover:border-gray-400"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
        
            <a href="/merchant/qr-batches/new" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-indigo-200 active:scale-95 flex items-center gap-2 whitespace-nowrap">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Buat Batch
            </a>
        </div>
    </div>

    {#if isLoading}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each Array(6) as _}
                <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-40"></div>
            {/each}
        </div>
    {:else if filteredBatches.length === 0}
        <div class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
             <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <h3 class="text-gray-900 font-medium">Data Kosong</h3>
            <p class="text-gray-500 text-sm mt-1 max-w-sm">Belum ada batch yang dibuat. Klik tombol "Buat Batch" untuk memulai.</p>
        </div>
    {:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredBatches as batch (batch.id)}
                {@const meta = getMetaInfo(batch)} 
                
                <a href={`/merchant/qr-batches/${batch.id}`} class="block bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 group relative overflow-hidden" transition:fade>
                
                    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0"></div>

                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div class="min-w-0 pr-2"> 
                                 <h3 class="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1" title={batch.batch_name || batch.batch_number}>
                                    {batch.batch_name || batch.batch_number || 'Batch Tanpa Nama'}
                                </h3>
    
                                <div class="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                                    <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                    
                                    <span class="line-clamp-1">
                                        {batch.product_name || batch.product?.name || 'Produk Tidak Dikenal'}
                                    </span>
                                </div>
                            </div>
                            
                            <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-100 min-w-[60px] text-center shrink-0">
                                {batch.quantity || batch.qr_codes_count || 0} Qty
                            </span>
                        </div>
                        
                       
                        {#if meta}
                            <div class="mb-4 flex flex-wrap gap-2">
                                {#if meta.date}
                                   <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        {meta.date}
                                    </span>
                                {/if}
                                {#if meta.note}
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100 max-w-full truncate">
                                         <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                                        {meta.note}
                                    </span>
                                {/if}
                                {#if meta.isCsv}
                                     <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        CSV Data
                                    </span>
                                {/if}
                            </div>
                        {/if}

                        <div class="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-50">
                            <div class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                {formatDate(batch.created_at)}
                            </div>
                            
                            <div class="flex items-center gap-1 text-green-600 font-medium ml-auto">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Generated
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>

{#if showGuide}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick={() => showGuide = false}></div>
        
        <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" transition:scale={{ start: 0.95, duration: 200 }}>
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Panduan QR Batches
                </h2>
                <button onclick={() => showGuide = false} class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-sm text-gray-600">
                
                <p>
                    <strong>Batch</strong> adalah cara efisien untuk membuat ribuan kode QR unik sekaligus. Setiap Batch terikat pada satu produk yang sudah Anda buat sebelumnya.
                </p>

                <div class="space-y-4">
                    <h3 class="font-bold text-gray-900 border-b border-gray-100 pb-2">Alur Kerja</h3>
                    
                    <div class="flex gap-4">
                        <div class="flex-none w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">1</div>
                        <div>
                            <strong class="text-gray-900 block">Buat Batch Baru</strong>
                            <p class="text-xs mt-1">Klik tombol "Buat Batch", pilih produk, dan tentukan jumlah QR yang ingin dibuat (misal: 1.000 pcs).</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="flex-none w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">2</div>
                        <div>
                            <strong class="text-gray-900 block">Proses Generate</strong>
                            <p class="text-xs mt-1">Sistem akan membuat kode unik secara otomatis. <span class="text-red-500 font-medium">Peringatan: Kuota Anda akan berkurang sesuai jumlah QR yang dibuat.</span></p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="flex-none w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">3</div>
                        <div>
                            <strong class="text-gray-900 block">Download & Cetak</strong>
                            <p class="text-xs mt-1">Setelah selesai, klik Batch untuk melihat detail dan mengunduh file .ZIP yang berisi gambar QR (PNG/SVG) siap cetak.</p>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                    <h4 class="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Tips Pencetakan
                    </h4>
                    <ul class="list-disc list-inside text-xs text-yellow-700 space-y-1">
                        <li>Pastikan ukuran QR Code saat dicetak <strong>minimal 2 x 2 cm</strong> agar mudah dipindai oleh kamera HP.</li>
                        <li>Jangan mengubah proporsi (gepeng/lebar) gambar QR Code.</li>
                        <li>Pastikan kontras tinggi (Warna hitam di atas putih) untuk hasil terbaik.</li>
                    </ul>
                </div>

            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
                <button onclick={() => showGuide = false} class="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                    Siap Membuat Batch
                </button>
            </div>
        </div>
    </div>
{/if}
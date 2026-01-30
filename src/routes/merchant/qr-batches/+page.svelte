<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import { fade } from 'svelte/transition';

    // State
    let batches = $state<any[]>([]);
    let isLoading = $state(true);
    let searchQuery = $state('');

    onMount(async () => {
        try {
            const res = await api('/qr-batches');
            batches = res.data || res;
        } catch (e) {
            console.error(e);
        } finally {
            isLoading = false;
        }
    });

    // Computed Filter
    let filteredBatches = $derived(
        batches.filter(b => 
            b.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Helper Date
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    // Helper: Parse Metadata
    function getMetaInfo(batch: any) {
        const meta = batch.metadata_sample;
        if (!meta) return null;

        // Parse jika masih string JSON (tergantung respon Laravel)
        const data = typeof meta === 'string' ? JSON.parse(meta) : meta;
        
        return {
            date: data.production_date ? formatDate(data.production_date) : null,
            note: data.note || null,
            // Deteksi jika ini batch CSV (biasanya punya key selain production_date/note)
            isCsv: !data.production_date && !data.note && Object.keys(data).length > 0
        };
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Riwayat Batch QR</h1>
            <p class="text-gray-500 mt-1 text-sm">Kelola semua batch produksi dan kode QR yang telah digenerate.</p>
        </div>

        <div class="flex gap-3 w-full md:w-auto">
            <div class="relative group flex-grow md:flex-grow-0">
                <input type="text" bind:value={searchQuery} placeholder="Cari nama batch..." class="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64 transition-all shadow-sm group-hover:border-gray-400">
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <a href="/merchant/qr-batches/new" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md shadow-indigo-200 active:scale-95 flex items-center gap-2 whitespace-nowrap">
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
            <h3 class="text-gray-900 font-medium">Data Kosong</h3>
        </div>
    {:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredBatches as batch (batch.id)}
                {@const meta = getMetaInfo(batch)} <a href={`/merchant/qr-batches/${batch.id}`} class="block bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 group relative overflow-hidden" transition:fade>
                    <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0"></div>

                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1" title={batch.batch_name}>
                                    {batch.batch_name}
                                </h3>
                                <div class="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                    <span class="line-clamp-1">{batch.product?.name || 'Produk Dihapus'}</span>
                                </div>
                            </div>
                            <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-100 min-w-[60px] text-center">
                                {batch.quantity || batch.qr_codes_count} Qty
                            </span>
                        </div>
                        
                        {#if meta}
                            <div class="mb-4 flex flex-wrap gap-2">
                                {#if meta.date}
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        Prod: {meta.date}
                                    </span>
                                {/if}
                                {#if meta.note}
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100 max-w-full truncate" title={meta.note}>
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                                        {meta.note}
                                    </span>
                                {/if}
                                {#if meta.isCsv}
                                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
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
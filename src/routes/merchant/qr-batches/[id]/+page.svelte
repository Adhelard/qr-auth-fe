<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';
    import { qrcode } from '$lib/actions/qrcode';

    let batchId = $page.params.id;
    let batch = $state<any>(null);
    let qrCodes = $state<any[]>([]);
    let isLoading = $state(true);
    let isDownloading = $state(false);

    // State Pagination
    let pagination = $state({
        current_page: 1,
        last_page: 1,
        total: 0,
        from: 0,
        to: 0,
        per_page: 100 
    });

    async function loadData(page = 1) {
        isLoading = true;
        try {
            // 1. Ambil Detail Batch
            if (!batch) {
                const res = await api(`/qr-batches/${batchId}`);
                batch = res.data || res;
            }
            
            // 2. Ambil List QR Codes
            const qrRes = await api(`/qr-codes?batch_id=${batchId}&page=${page}`);
            
            // Handle struktur pagination Laravel yang mungkin dibungkus .data atau langsung
            const responseData = qrRes.data || qrRes; // Jaga-jaga jika pagination di root

            qrCodes = responseData.data || responseData; // Array QR codes
            
            // Update pagination state dengan fallback
            pagination = {
                current_page: qrRes.current_page || 1,
                last_page: qrRes.last_page || 1,
                total: qrRes.total || 0,
                from: qrRes.from || 0,
                to: qrRes.to || 0,
                per_page: qrRes.per_page || 100
            };
            
        } catch (e) {
            console.error(e);
            // Jangan alert di loadData agar tidak spam saat mount
        } finally {
            isLoading = false;
        }
    }

    function changePage(newPage: number) {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            loadData(newPage);
        }
    }

    onMount(() => loadData(1));

    async function handleDownloadZip() {
        if(!batch) return;
        isDownloading = true;
        
        // FIX: Gunakan nama batch yang tersedia
        const safeName = (batch.batch_name || batch.batch_number || 'Batch').replace(/\s+/g, '_');
        
        try {
            // Gunakan API service yang sudah ada fitur auth header-nya agar lebih rapi
            // Tapi karena responseType blob, kita pakai fetch manual dengan userState.token
            const response = await fetch(`http://localhost:8000/api/qr-batches/${batchId}/download-zip`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/json', 
                }
            });

            if (!response.ok) {
                let errorMsg = 'Gagal mengunduh ZIP';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (e) { /* ignore json parse error */ }
                throw new Error(errorMsg);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${safeName}_QR.zip`; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e: any) {
            alert('Gagal: ' + e.message);
        } finally {
            isDownloading = false;
        }
    }
</script>

{#if !batch && isLoading}
    <div class="flex h-64 justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
    </div>
{:else if batch}
    <div class="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                        BATCH #{batch.batch_number || batch.id}
                    </span>
                    <span class="text-sm text-gray-500">
                        {new Date(batch.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </span>
                </div>
                
                <h1 class="text-3xl font-extrabold text-gray-900">
                    {batch.batch_name || batch.batch_number || 'Batch Tanpa Nama'}
                </h1>
                
                <div class="mt-2 text-gray-600 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    Produk: 
                    <span class="font-semibold text-gray-900">
                        {batch.product_name || batch.product?.name || 'Produk Tidak Diketahui'}
                    </span>
                </div>
            </div>
        
            <div>
                <button onclick={handleDownloadZip} disabled={isDownloading} class="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {#if isDownloading}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Processing ZIP...</span>
                    {:else}
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        <span>Download All Images (.ZIP)</span>
                    {/if}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div><div class="text-xs text-gray-500 uppercase font-semibold">Total Qty</div><div class="text-xl font-bold text-gray-900">{batch.quantity || 0}</div></div>
            <div><div class="text-xs text-gray-500 uppercase font-semibold">Status</div><div class="text-xl font-bold text-green-600">Generated</div></div>
            <div><div class="text-xs text-gray-500 uppercase font-semibold">Scanned</div><div class="text-xl font-bold text-blue-600">{batch.scanned_count || 0}</div></div>
            <div><div class="text-xs text-gray-500 uppercase font-semibold">Limit</div><div class="text-xl font-bold text-gray-400">{pagination.per_page}/page</div></div>
        </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        {#if isLoading && batch} 
            <div class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        {/if}

        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="font-bold text-gray-800">Daftar Kode QR</h3>
            <span class="text-xs text-gray-500">Menampilkan {pagination.from || 0}-{pagination.to || 0} dari {pagination.total || 0} data</span>
        </div>
        
        {#if qrCodes.length > 0}
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th class="px-6 py-3 w-10">No</th>
                            <th class="px-6 py-3">Unique Code</th>
                            <th class="px-6 py-3">Preview</th>
                            <th class="px-6 py-3">Link Verifikasi</th>
                            <th class="px-6 py-3 text-center">Scan Count</th>
                            <th class="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each qrCodes as qr, i}
                            <tr class="hover:bg-blue-50/50 transition duration-150">
                                <td class="px-6 py-3 text-gray-400 font-mono text-xs">
                                    {(pagination.current_page - 1) * pagination.per_page + i + 1}
                                </td>
                                <td class="px-6 py-3">
                                    <span class="font-mono text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded select-all">{qr.unique_code}</span>
                                </td>
                                <td class="px-6 py-3">
                                    <div class="bg-white p-1 inline-block rounded border border-gray-200">
                                        <canvas use:qrcode={`http://localhost:5173/verify/${qr.unique_code}`} class="w-10 h-10"></canvas>
                                    </div>
                                </td>
                                <td class="px-6 py-3">
                                    <a href={`/verify/${qr.unique_code}`} target="_blank" class="text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1">
                                        Test Link
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    </a>
                                </td>
                                <td class="px-6 py-3 text-center">
                                    {#if qr.scan_count > 0}
                                        <span class="text-brand-600 font-bold">{qr.scan_count}</span>
                                    {:else}
                                        <span class="text-gray-300">-</span>
                                    {/if}
                                </td>
                                <td class="px-6 py-3 text-center">
                                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aktif</span>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div class="text-xs text-gray-500 md:hidden">
                    Halaman {pagination.current_page} / {pagination.last_page}
                </div>
                <div class="hidden md:block text-xs text-gray-500">
                    Menampilkan <strong>{pagination.from}</strong> sampai <strong>{pagination.to}</strong> dari <strong>{pagination.total}</strong> hasil
                </div>
                <div class="flex items-center gap-2">
                    <button onclick={() => changePage(pagination.current_page - 1)} disabled={pagination.current_page === 1} class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Previous
                    </button>
                    <div class="hidden md:flex gap-1">
                        {#each Array(pagination.last_page) as _, i}
                            {@const p = i + 1}
                            {#if p === 1 || p === pagination.last_page || (p >= pagination.current_page - 1 && p <= pagination.current_page + 1)}
                                <button onclick={() => changePage(p)} class={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${pagination.current_page === p ? 'bg-brand-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            {:else if p === pagination.current_page - 2 || p === pagination.current_page + 2}
                                <span class="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">...</span>
                            {/if}
                        {/each}
                    </div>
                    <button onclick={() => changePage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} class="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                        Next
                    </button>
                </div>
            </div>

        {:else}
            <div class="p-12 text-center text-gray-500">
                Tidak ada data QR Code ditemukan.
            </div>
        {/if}
    </div>
{/if}
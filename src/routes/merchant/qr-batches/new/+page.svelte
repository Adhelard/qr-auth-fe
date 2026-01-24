<script lang="ts">
    import { api } from '$lib/services/api';
    import { goto } from '$app/navigation';

    let products = $state<any[]>([]);
    let form = $state({
        product_id: '',
        batch_name: '',
        quantity: 100 // Default value
    });
    let isSubmitting = $state(false);

    onMount(async () => {
        // Kita butuh list produk untuk dropdown
        const res = await api('/products');
        products = res.data || res;
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;
        try {
            await api('/qr-batches', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            goto('/merchant/qr-batches');
        } catch (error: any) {
            alert(error.message);
        } finally {
            isSubmitting = false;
        }
    }
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
     // Kita akan pake fetch native utk blob, atau modif api wrapper
    import { userState } from '$lib/stores/user.svelte'; // Butuh token manual buat fetch blob
    
    // ... variable yang sudah ada ...
    let isDownloading = $state(false); // State baru untuk loading download

    // ... function loadData & handleGenerate yang sudah ada ...

    // FUNGSI BARU: DOWNLOAD ZIP
    async function handleDownloadZip() {
        isDownloading = true;
        try {
            // Kita pakai fetch native karena perlu handle 'blob', bukan JSON
            const response = await fetch(`http://localhost:8000/api/qr-batches/${batchId}/download-zip`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/zip' // Memberitahu backend kita mau file
                }
            });

            if (!response.ok) throw new Error('Gagal mengunduh ZIP');

            // 1. Ambil data binary
            const blob = await response.blob();

            // 2. Buat URL object sementara
            const url = window.URL.createObjectURL(blob);

            // 3. Buat elemen <a> tersembunyi untuk trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${batch.batch_name.replace(/\s+/g, '_')}_QR.zip`; // Nama file
            document.body.appendChild(a);
            a.click();

            // 4. Bersihkan
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            isDownloading = false;
        }
    }
</script>

<div class="max-w-xl mx-auto">
    <div class="mb-6">
        <a href="/merchant/qr-batches" class="text-gray-500 hover:text-gray-900 text-sm mb-2 inline-block">← Kembali</a>
        <h1 class="text-2xl font-bold text-gray-800">Plan Batch Produksi</h1>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onsubmit={handleSubmit} class="space-y-6">
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Produk</label>
                <select bind:value={form.product_id} required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                    <option value="" disabled selected>-- Pilih Produk --</option>
                    {#each products as product}
                        <option value={product.id}>{product.name} ({product.sku})</option>
                    {/each}
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Batch / Lot Produksi</label>
                <input bind:value={form.batch_name} type="text" required placeholder="Contoh: Lot Jan-2026 A" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                <p class="text-xs text-gray-500 mt-1">Gunakan nama yang mudah diidentifikasi saat tracking.</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah QR Code (Kuota)</label>
                <input bind:value={form.quantity} type="number" min="1" max="10000" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting} 
                class="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-3"
            >
                {#if isSubmitting}
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sedang membuat {form.quantity} Kode QR...</span>
                {:else}
                    <span>🚀 Buat & Generate Batch</span>
                {/if}
            </button>
        </form>
    </div>
</div>
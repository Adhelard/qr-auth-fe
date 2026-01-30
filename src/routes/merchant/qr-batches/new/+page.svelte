<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userState } from '$lib/stores/user.svelte';
    import { api } from '$lib/services/api';

    // State
    let products = $state<any[]>([]);
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    // Mode: 'manual' atau 'csv'
    let mode = $state('manual'); 

    // Form State
    let form = $state({
        product_id: '',
        batch_name: '',
        quantity: 100,
        production_date: '', // Field Baru
        note: ''            // Field Baru (Opsional)
    });

    // File State
    let csvFile: File | null = null;

    onMount(async () => {
        try {
            const res = await api('/products');
            products = res.data || res;
        } catch (e) {
            console.error(e);
        }
    });

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            csvFile = input.files[0];
        }
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;
        errorMessage = '';

        try {
            // Kita wajib pakai FormData karena ada potensi upload file
            const formData = new FormData();
            
            // Data Wajib Semua Mode
            formData.append('type', mode);
            formData.append('product_id', form.product_id);
            formData.append('batch_name', form.batch_name);

            if (mode === 'manual') {
                // Mode Manual: Kirim Quantity & Metadata Tambahan
                formData.append('quantity', form.quantity.toString());
                
                if (form.production_date) {
                    formData.append('production_date', form.production_date);
                }
                if (form.note) {
                    formData.append('custom_note', form.note);
                }

            } else {
                // Mode CSV: Kirim File
                if (!csvFile) {
                    throw new Error("Harap upload file CSV terlebih dahulu.");
                }
                formData.append('csv_file', csvFile);
            }

            // PENTING: Gunakan fetch native untuk FormData (agar header multipart benar)
            // Sesuaikan URL dengan backend Anda
            const response = await fetch('http://localhost:8000/api/qr-batches', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/json'
                    // Jangan set Content-Type, biarkan browser set boundary otomatis
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal membuat batch.');
            }

            // Sukses
            goto('/merchant/qr-batches');

        } catch (error: any) {
            errorMessage = error.message;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto py-6 px-4">
    <div class="mb-6">
        <a href="/merchant/qr-batches" class="text-gray-500 hover:text-gray-900 text-sm mb-2 inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Kembali
        </a>
        <h1 class="text-2xl font-bold text-gray-800">Buat Batch QR Baru</h1>
        <p class="text-gray-500 text-sm mt-1">Generate kode QR untuk produksi baru.</p>
    </div>

    {#if errorMessage}
        <div class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {errorMessage}
        </div>
    {/if}

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onsubmit={handleSubmit} class="space-y-6">
            
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Produk</label>
                <select 
                    bind:value={form.product_id} 
                    required 
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all"
                >
                    <option value="" disabled selected>-- Pilih Produk --</option>
                    {#each products as product}
                        <option value={product.id}>{product.name} (SKU: {product.sku})</option>
                    {/each}
                </select>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Batch / Lot</label>
                <input 
                    bind:value={form.batch_name} 
                    type="text" 
                    required 
                    placeholder="Contoh: Produksi Jan 2026 - Shift A" 
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                />
            </div>

            <hr class="border-gray-100 my-6">

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Metode Data QR</label>
                <div class="flex p-1 bg-gray-100 rounded-xl mb-4">
                    <button 
                        type="button"
                        class="flex-1 py-2 text-sm font-medium rounded-lg transition-all {mode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
                        onclick={() => mode = 'manual'}
                    >
                        ⚡ Generator Biasa
                    </button>
                    <button 
                        type="button"
                        class="flex-1 py-2 text-sm font-medium rounded-lg transition-all {mode === 'csv' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
                        onclick={() => mode = 'csv'}
                    >
                        📂 Upload CSV (Bulk Data)
                    </button>
                </div>

                {#if mode === 'manual'}
                    <div class="space-y-5 animate-fade-in">
                        <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
                            Mode ini akan membuat QR Code dengan jumlah yang sama dan data yang seragam.
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah QR</label>
                                <input 
                                    bind:value={form.quantity} 
                                    type="number" 
                                    min="1" max="10000" 
                                    required 
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tgl. Produksi (Opsional)</label>
                                <input 
                                    bind:value={form.production_date} 
                                    type="date" 
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                            <input 
                                bind:value={form.note} 
                                type="text" 
                                placeholder="Cth: Warna Merah, Size XL"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                            />
                            <p class="text-xs text-gray-500 mt-1">Info ini akan muncul saat QR discan.</p>
                        </div>
                    </div>
                
                {:else}
                    <div class="space-y-4 animate-fade-in">
                        <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                            <h4 class="text-sm font-bold text-yellow-800 mb-1">Format File CSV:</h4>
                            <p class="text-xs text-yellow-700 mb-2">Baris pertama wajib nama kolom (header). Jumlah QR code akan mengikuti jumlah baris data.</p>
                            <div class="bg-white border border-yellow-200 rounded p-2 font-mono text-xs text-gray-600 overflow-x-auto">
                                Warna,Ukuran,Expired Date<br>
                                Hitam,L,2025-12-31<br>
                                Putih,M,2025-12-31
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Upload File CSV</label>
                            <input 
                                type="file" 
                                accept=".csv" 
                                required
                                onchange={handleFileSelect}
                                class="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100
                                    border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                        </div>
                    </div>
                {/if}
            </div>

            <div class="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                    {#if isSubmitting}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memproses...</span>
                    {:else}
                        {#if mode === 'manual'}
                            <span>🚀 Generate {form.quantity} QR Code</span>
                        {:else}
                            <span>📂 Upload & Generate dari CSV</span>
                        {/if}
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    /* Simple fade in animation */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }
</style>
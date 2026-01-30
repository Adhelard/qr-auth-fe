<script lang="ts">
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { userState } from '$lib/stores/user.svelte'; // Asumsi store user ada di sini

    // State
    let isSubmitting = $state(false);
    let errorMessage = $state('');
    
    // Form State
    let form = $state({
        name: '',
        sku: '',
        description: '',
        active: true
    });

    // File Handling State
    let selectedFile: File | null = null;
    let previewUrl: string | null = $state(null);
    let fileInput: HTMLInputElement;

    // Fungsi Generate SKU Otomatis
    function generateSKU() {
        const prefix = form.name ? form.name.substring(0, 3).toUpperCase() : 'PRD';
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        form.sku = `${prefix}-${random}`;
    }

    // Handle File Selection
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Validasi Size (Max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                errorMessage = "Ukuran gambar terlalu besar (Maksimal 2MB)";
                return;
            }

            selectedFile = file;
            previewUrl = URL.createObjectURL(file);
            errorMessage = ''; // Clear error
        }
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;
        errorMessage = '';

        try {
            const formData = new FormData();
            
            // Append data text
            formData.append('name', form.name);
            formData.append('sku', form.sku);
            formData.append('description', form.description);
            formData.append('active', form.active ? '1' : '0');

            // Append file jika ada
            if (selectedFile) {
                formData.append('image', selectedFile); 
            }

            // PENTING: Gunakan fetch native untuk upload file agar boundary header otomatis
            const response = await fetch('http://localhost:8000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/json'
                    // Jangan set Content-Type manual untuk FormData
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    // Ambil error pertama dari Laravel validation
                    throw new Error(Object.values(result.errors)[0] as string);
                }
                throw new Error(result.message || 'Gagal menyimpan produk');
            }

            // Redirect sukses
            goto('/merchant/products');

        } catch (error: any) {
            errorMessage = error.message;
            // Scroll ke atas agar error terlihat
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Tambah Produk</h1>
            <p class="text-gray-500 mt-1">Isi detail produk untuk ditampilkan di katalog.</p>
        </div>
        <a href="/merchant/products" class="text-gray-500 hover:text-gray-700 font-medium text-sm">
            &larr; Kembali
        </a>
    </div>
    
    {#if errorMessage}
        <div transition:fade class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {errorMessage}
        </div>
    {/if}

    <form onsubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informasi Dasar</h2>
                
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Produk</label>
                        <input 
                            bind:value={form.name} 
                            type="text" 
                            required 
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400" 
                            placeholder="Contoh: Kopi Arabika Gayo 250g" 
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                        <textarea 
                            bind:value={form.description} 
                            rows="5" 
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 resize-none"
                            placeholder="Jelaskan detail produk, komposisi, atau keunggulan..."
                        ></textarea>
                        <p class="text-xs text-gray-500 mt-2 text-right">Maksimal 500 karakter</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-5">Foto Produk</h2>
                
                <div 
                    class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group"
                    onclick={() => fileInput.click()}
                >
                    {#if previewUrl}
                        <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img src={previewUrl} alt="Preview" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-white text-sm font-medium">Ganti Foto</span>
                            </div>
                        </div>
                    {:else}
                        <div class="py-8 flex flex-col items-center justify-center text-gray-500">
                            <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span class="text-sm font-medium text-indigo-600">Upload Foto</span>
                            <span class="text-xs mt-1">PNG, JPG up to 2MB</span>
                        </div>
                    {/if}
                    
                    <input 
                        bind:this={fileInput}
                        type="file" 
                        accept="image/*" 
                        class="hidden" 
                        onchange={handleFileSelect}
                    />
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-5">Inventaris</h2>
                
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1.5">SKU (Kode Stok)</label>
                        <div class="flex gap-2">
                            <input 
                                bind:value={form.sku} 
                                type="text" 
                                required 
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono text-sm" 
                                placeholder="Cth: PRD-001" 
                            />
                            <button 
                                type="button"
                                onclick={generateSKU}
                                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition-colors"
                                title="Generate Random SKU"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div class="flex flex-col">
                            <span class="text-sm font-medium text-gray-900">Status Aktif</span>
                            <span class="text-xs text-gray-500">Tampilkan di katalog</span>
                        </div>
                        
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" bind:checked={form.active} class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
                <a href="/merchant/products" class="flex justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Batal
                </a>
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    class="flex justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>

        </div>
    </form>
</div>
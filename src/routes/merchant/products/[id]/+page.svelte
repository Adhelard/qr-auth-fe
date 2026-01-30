<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';

    // Ambil ID dari URL
    const productId = $page.params.id;

    // State
    let isLoading = $state(true);
    let isSaving = $state(false);
    let errorMessage = $state('');
    let successMessage = $state('');

    // Form State
    let form = $state({
        name: '',
        sku: '',
        description: '',
        active: true
    });

    // Image State
    let previewUrl: string | null = $state(null);
    let selectedFile: File | null = null;
    let fileInput: HTMLInputElement;

    // 1. Fetch Data Produk saat Halaman Dibuka
    onMount(async () => {
        try {
            const res = await api(`/products/${productId}`);
            const data = res.data || res;

            form = {
                name: data.name,
                sku: data.sku,
                description: data.description || '',
                active: Boolean(data.active)
            };

            // Jika ada gambar dari backend, set ke preview
            if (data.image_url) {
                previewUrl = data.image_url;
            }
        } catch (e) {
            console.error(e);
            errorMessage = 'Gagal mengambil data produk.';
        } finally {
            isLoading = false;
        }
    });

    // 2. Handle Ganti Gambar
    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar maksimal 2MB");
                return;
            }

            selectedFile = file;
            previewUrl = URL.createObjectURL(file); // Preview gambar baru lokal
        }
    }

    // 3. Simpan Perubahan
    async function handleUpdate(e: Event) {
        e.preventDefault();
        isSaving = true;
        errorMessage = '';
        successMessage = '';

        try {
            const formData = new FormData();
            
            // TRICK LARAVEL: Gunakan POST tapi spoof method jadi PUT agar file terbaca
            formData.append('_method', 'PUT'); 

            formData.append('name', form.name);
            formData.append('sku', form.sku);
            formData.append('description', form.description);
            formData.append('active', form.active ? '1' : '0');

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            // Gunakan native fetch untuk FormData
            const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
                method: 'POST', // Tetap POST secara HTTP
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    throw new Error(Object.values(result.errors)[0] as string);
                }
                throw new Error(result.message || 'Gagal mengupdate produk');
            }

            successMessage = 'Produk berhasil diperbarui!';
            
            // Redirect kembali ke list setelah 1 detik
            setTimeout(() => {
                goto('/merchant/products');
            }, 1000);

        } catch (e: any) {
            errorMessage = e.message;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Edit Produk</h1>
            <p class="text-gray-500 mt-1">Perbarui informasi detail produk Anda.</p>
        </div>
        <a href="/merchant/products" class="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1">
            &larr; Kembali
        </a>
    </div>

    {#if isLoading}
        <div class="p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
            <div class="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p class="text-gray-400">Sedang memuat data...</p>
        </div>
    {:else}
        {#if errorMessage}
            <div class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {errorMessage}
            </div>
        {/if}

        {#if successMessage}
            <div class="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {successMessage}
            </div>
        {/if}

        <form onsubmit={handleUpdate} class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-3">Informasi Utama</h2>
                    
                    <div class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Produk</label>
                            <input 
                                bind:value={form.name} 
                                type="text" 
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                            <textarea 
                                bind:value={form.description} 
                                rows="6" 
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800 mb-5">Foto Produk</h2>
                    
                    <div 
                        class="border-2 border-dashed border-gray-300 rounded-xl p-2 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative"
                        onclick={() => fileInput.click()}
                    >
                        {#if previewUrl}
                            <div class="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img src={previewUrl} alt="Preview" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span class="text-white text-sm font-medium">Klik untuk Ubah</span>
                                </div>
                            </div>
                        {:else}
                            <div class="aspect-square flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span class="text-xs">Upload Gambar</span>
                            </div>
                        {/if}
                        
                        <input 
                            bind:this={fileInput}
                            type="file" 
                            accept="image/*" 
                            class="hidden" 
                            onchange={handleFileSelect}
                        >
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-800 mb-5">Inventaris</h2>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1.5">SKU (Kode Stok)</label>
                            <input 
                                bind:value={form.sku} 
                                type="text" 
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm uppercase"
                            >
                        </div>

                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span class="text-sm font-medium text-gray-900">Status Aktif</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" bind:checked={form.active} class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
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
                        disabled={isSaving} 
                        class="flex justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {#if isSaving}
                            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        {/if}
                        Simpan Perubahan
                    </button>
                </div>

            </div>
        </form>
    {/if}
</div>
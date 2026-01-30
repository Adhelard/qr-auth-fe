<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';

    // State menggunakan Runes
    let isLoading = $state(true);
    let isSaving = $state(false);
    let errorMessage = $state('');
    let successMessage = $state('');

    // State Form
    let form = $state({
        name: '',
        company_name: '',
        email: '', 
        slug: '',
        logo_url: '' as string | null
    });

    // State untuk File Upload
    let selectedFile: File | null = null;
    let previewUrl: string | null = $state(null);
    let fileInput: HTMLInputElement; // Binding ke elemen input

    onMount(async () => {
        try {
            const res = await api('/merchant/profile');
            // Mapping response ke form
            const data = res.data || res;
            form = {
                name: data.name || '',
                company_name: data.company_name || '',
                email: data.email || '',
                slug: data.slug || '',
                logo_url: data.logo_url || null
            };
            
            if (form.logo_url) {
                previewUrl = form.logo_url;
            }
        } catch (e) {
            console.error(e);
            errorMessage = 'Gagal memuat data profil.';
        } finally {
            isLoading = false;
        }
    });

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Validasi sederhana (Max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file terlalu besar (Maksimal 2MB)");
                return;
            }

            selectedFile = file;
            previewUrl = URL.createObjectURL(selectedFile);
        }
    }

    function triggerFileInput() {
        fileInput.click();
    }

    async function handleSave(e: Event) {
        e.preventDefault();
        isSaving = true;
        errorMessage = '';
        successMessage = '';

        try {
            const formData = new FormData();
            
            // Trik Laravel: Gunakan POST tapi spoof method menjadi PUT/PATCH agar file terbaca
            formData.append('_method', 'POST'); // Atau 'PUT' tergantung route backend Anda
            
            formData.append('name', form.name);
            formData.append('company_name', form.company_name);

            if (selectedFile) {
                formData.append('logo', selectedFile);
            }

            // Kita gunakan fetch native untuk kontrol penuh atas headers
            // URL disesuaikan (pastikan port backend benar, misal 8000)
            const response = await fetch('http://localhost:8000/api/merchant/profile', {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${userState.token}`,
                    'Accept': 'application/json'
                    // PENTING: Jangan set Content-Type secara manual saat pakai FormData!
                    // Browser akan otomatis set multipart/form-data + boundary
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle validasi error dari Laravel
                if (result.errors) {
                    const firstError = Object.values(result.errors)[0] as string[];
                    throw new Error(firstError[0]);
                }
                throw new Error(result.message || 'Gagal menyimpan profil');
            }

            successMessage = 'Profil berhasil diperbarui!';
            
            // Update global user state agar navbar/sidebar berubah real-time
            if (userState.user) {
                userState.user.name = form.name;
                // Jika backend mengembalikan URL logo baru, update juga
                if (result.data?.logo_url) {
                    userState.user.logo_url = result.data.logo_url;
                }
            }

            // Hilangkan pesan sukses setelah 3 detik
            setTimeout(() => successMessage = '', 3000);

        } catch (e: any) {
            errorMessage = e.message || 'Terjadi kesalahan sistem.';
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="max-w-full mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Pengaturan Profil</h1>
        <p class="text-gray-500 mt-2">Kelola informasi perusahaan dan branding Anda.</p>
    </div>

    {#if isLoading}
        <div class="flex items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
            <div class="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
            <span class="text-gray-400 font-medium">Memuat data profil...</span>
        </div>
    {:else}
        {#if errorMessage}
            <div transition:fade class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {errorMessage}
            </div>
        {/if}

        {#if successMessage}
            <div transition:fade class="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {successMessage}
            </div>
        {/if}

        <form onsubmit={handleSave} class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            <div class="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div class="px-8 pb-10">
                <div class="relative -mt-16 mb-8 flex flex-col sm:flex-row items-end sm:items-center gap-6">
                    <div class="relative group">
                        <div class="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 overflow-hidden relative">
                            {#if previewUrl}
                                <img src={previewUrl} alt="Logo Perusahaan" class="w-full h-full object-cover rounded-xl bg-gray-50">
                            {:else}
                                <div class="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                            {/if}

                            <button 
                                type="button"
                                onclick={triggerFileInput}
                                class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer rounded-xl backdrop-blur-[2px]"
                            >
                                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
                                <span class="text-xs font-medium">Ubah Foto</span>
                            </button>
                        </div>

                        <input 
                            bind:this={fileInput}
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg" 
                            class="hidden" 
                            onchange={handleFileSelect}
                        >
                    </div>

                    <div class="mb-2">
                        <h2 class="text-xl font-bold text-gray-900">{form.company_name || 'Nama Perusahaan'}</h2>
                        <p class="text-sm text-gray-500">{form.slug ? `qrverify.com/${form.slug}` : 'Belum ada slug'}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">Nama Pemilik</label>
                        <div class="relative">
                            <input 
                                bind:value={form.name} 
                                type="text" 
                                placeholder="Nama lengkap Anda"
                                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">Email Login</label>
                        <div class="relative">
                            <input 
                                value={form.email} 
                                type="text" 
                                disabled 
                                class="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed select-none"
                            >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                    </div>

                    <div class="md:col-span-2 space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">Nama Brand / Perusahaan</label>
                        <div class="relative">
                            <input 
                                bind:value={form.company_name} 
                                type="text" 
                                placeholder="Contoh: PT Teknologi Maju Jaya"
                                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <p class="text-xs text-gray-500 pt-1 ml-1">Nama ini akan ditampilkan pada halaman verifikasi publik.</p>
                    </div>

                    <div class="md:col-span-2 space-y-1">
                        <label class="block text-sm font-semibold text-gray-700">URL Verifikasi</label>
                        <div class="flex items-center group">
                            <span class="bg-gray-100 border border-r-0 border-gray-300 px-4 py-2.5 rounded-l-lg text-gray-500 text-sm font-medium group-hover:border-gray-400 transition-colors">
                                qrverify.com/
                            </span>
                            <input 
                                value={form.slug} 
                                type="text" 
                                disabled 
                                class="w-full px-4 py-2.5 border border-gray-300 bg-gray-50/50 rounded-r-lg text-gray-600 font-medium cursor-not-allowed group-hover:border-gray-400 transition-colors"
                            >
                        </div>
                    </div>
                </div>

                <div class="pt-8 mt-8 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button 
                        type="button" 
                        class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        onclick={() => window.location.reload()}
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
                    >
                        {#if isSaving}
                            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menyimpan...
                        {:else}
                            <span>Simpan Perubahan</span>
                        {/if}
                    </button>
                </div>

            </div>
        </form>
    {/if}
</div>
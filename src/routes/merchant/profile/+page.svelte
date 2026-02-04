<script lang="ts">
    import { onMount } from 'svelte';
    import { userState } from '$lib/stores/user.svelte';
    import { api } from '$lib/services/api';
    import { fade, scale } from 'svelte/transition';

    let isLoading = $state(false);
    let isSaving = $state(false);
    let showGuide = $state(false); // State untuk modal panduan

    let formData = $state({
        name: '',
        company_name: '',
        slug: '', // Read-only biasanya
        phone: '',
        address: '',
        logo_url: ''
    });

    let logoFile: File | null = null;
    let logoPreview = $state<string | null>(null);

    onMount(async () => {
        // --- HOOK OTOMATIS (Profile) ---
        const hasSeenGuide = localStorage.getItem('profile_guide_seen_v1');
        if (!hasSeenGuide) {
            setTimeout(() => {
                showGuide = true;
                localStorage.setItem('profile_guide_seen_v1', 'true');
            }, 1000);
        }
        // ------------------------------

        isLoading = true;
        try {
            const user = await api('/merchant/profile'); 
            // Sesuaikan mapping data dengan response backend Anda
            formData = {
                name: user.name || '',
                company_name: user.company_name || '',
                slug: user.slug || '',
                phone: user.phone || '',
                address: user.address || '',
                logo_url: user.logo_url || ''
            };
            if(formData.logo_url) {
                logoPreview = formData.logo_url;
            }
        } catch (e) {
            console.error(e);
        } finally {
            isLoading = false;
        }
    });

    function handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            logoFile = input.files[0];
            logoPreview = URL.createObjectURL(logoFile);
        }
    }

    async function handleSubmit() {
        isSaving = true;
        try {
            // Gunakan FormData untuk upload file
            const data = new FormData();
            data.append('name', formData.name);
            data.append('company_name', formData.company_name);
            data.append('phone', formData.phone);
            data.append('address', formData.address);
            
            if (logoFile) {
                data.append('logo', logoFile);
            }

            // Method Spoofing jika backend Laravel resource butuh PUT
            data.append('_method', 'PUT'); 

            await api('/merchant/profile', {
                method: 'POST', // Gunakan POST dengan _method: PUT untuk upload file
                body: data,
                // Jangan set Content-Type header secara manual saat pakai FormData, 
                // browser akan otomatis set boundary.
                headers: {} 
            });

            alert('Profil berhasil diperbarui!');
            
            // Update global state user jika nama berubah
            if(userState.user) {
                userState.user.name = formData.name;
            }

        } catch (e: any) {
            alert(e.message || 'Gagal menyimpan profil');
        } finally {
            isSaving = false;
        }
    }
</script>

<svelte:head>
    <title>Profil Perusahaan - {userState.user?.name}</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Profil Perusahaan</h1>
            <p class="text-slate-500 text-sm mt-1">Informasi ini akan tampil pada halaman verifikasi produk Anda.</p>
        </div>
        
        <button 
            onclick={() => showGuide = true}
            class="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition shadow-sm"
        >
            <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Panduan Profil
        </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {#if isLoading}
            <div class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        {:else}
            <form class="space-y-8" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                
                <div class="flex flex-col sm:flex-row gap-6 items-start border-b border-slate-100 pb-8">
                    <div class="w-full sm:w-1/3">
                        <label class="block text-sm font-bold text-slate-900 mb-1">Logo Perusahaan</label>
                        <p class="text-xs text-slate-500">Akan tampil di pojok kiri atas saat konsumen scan QR.</p>
                    </div>
                    <div class="w-full sm:w-2/3 flex items-center gap-6">
                        <div class="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group">
                            {#if logoPreview}
                                <img src={logoPreview} alt="Logo Preview" class="w-full h-full object-cover" />
                            {:else}
                                <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {/if}
                            
                            <div class="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer" onclick={() => document.getElementById('logoInput')?.click()}>
                                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </div>
                        </div>
                        
                        <div>
                            <input 
                                type="file" 
                                id="logoInput" 
                                accept="image/*" 
                                class="hidden" 
                                onchange={handleFileChange}
                            />
                            <button type="button" onclick={() => document.getElementById('logoInput')?.click()} class="text-sm font-medium text-brand-600 hover:text-brand-700 border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-lg transition">
                                Upload Logo Baru
                            </button>
                            <p class="text-xs text-slate-400 mt-2">JPG, PNG, atau SVG. Maks 2MB.</p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-6 items-start">
                    <div class="w-full sm:w-1/3">
                        <label class="block text-sm font-bold text-slate-900 mb-1">Identitas Perusahaan</label>
                        <p class="text-xs text-slate-500">Nama brand resmi yang digunakan.</p>
                    </div>
                    <div class="w-full sm:w-2/3 space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Nama Perusahaan / Brand</label>
                            <input 
                                type="text" 
                                bind:value={formData.company_name} 
                                class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                placeholder="Contoh: PT. Makmur Jaya Abadi"
                            />
                        </div>
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">Nama Penanggung Jawab</label>
                                <input 
                                    type="text" 
                                    bind:value={formData.name} 
                                    class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-700 mb-1">No. Telepon / CS</label>
                                <input 
                                    type="text" 
                                    bind:value={formData.phone} 
                                    class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    placeholder="+62..."
                                />
                            </div>
                        </div>
                         <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">Alamat Kantor</label>
                            <textarea 
                                bind:value={formData.address} 
                                rows="3"
                                class="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                placeholder="Alamat lengkap..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-6 items-start border-t border-slate-100 pt-8">
                    <div class="w-full sm:w-1/3">
                        <label class="block text-sm font-bold text-slate-900 mb-1">URL Publik</label>
                        <p class="text-xs text-slate-500">Link unik untuk halaman verifikasi brand Anda.</p>
                    </div>
                    <div class="w-full sm:w-2/3">
                        <div class="flex items-center">
                            <span class="bg-slate-100 border border-r-0 border-slate-300 text-slate-500 sm:text-sm text-xs px-3 py-2 rounded-l-lg">
                                qrverify.com/verify/
                            </span>
                            <input 
                                type="text" 
                                value={formData.slug} 
                                readonly
                                class="w-full px-4 py-2 border border-slate-300 rounded-r-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <p class="text-[10px] text-slate-400 mt-1">*Hubungi admin jika ingin mengubah URL slug ini.</p>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        class="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {#if isSaving}
                            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Menyimpan...
                        {:else}
                            Simpan Perubahan
                        {/if}
                    </button>
                </div>

            </form>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Panduan Profil Perusahaan
                </h2>
                <button onclick={() => showGuide = false} class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
                
                <p>
                    Halaman ini digunakan untuk mengatur informasi publik yang akan dilihat konsumen saat mereka memindai kode QR Anda.
                </p>

                <div class="space-y-4">
                    <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div class="shrink-0 text-brand-600 bg-white p-2 rounded-lg shadow-sm h-10 w-10 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                            <strong class="text-slate-900 block text-base">Pentingnya Logo</strong>
                            <p class="mt-1 leading-relaxed">
                                Logo yang Anda upload di sini akan muncul di bagian paling atas halaman hasil scan. Pastikan logo terlihat profesional dan memiliki latar belakang transparan (PNG) agar menyatu dengan desain.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div class="shrink-0 text-brand-600 bg-white p-2 rounded-lg shadow-sm h-10 w-10 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        </div>
                        <div>
                            <strong class="text-slate-900 block text-base">Tentang URL Slug</strong>
                            <p class="mt-1 leading-relaxed">
                                URL Slug (misal: <code>/verify/adidas</code>) dibuat otomatis saat pendaftaran. Ini memastikan tidak ada brand lain yang bisa memalsukan identitas digital Anda. Jika ingin mengubahnya, silakan hubungi tim support.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
                <button onclick={() => showGuide = false} class="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                    Selesai
                </button>
            </div>
        </div>
    </div>
{/if}
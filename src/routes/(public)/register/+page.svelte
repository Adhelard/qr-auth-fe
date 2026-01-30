<script lang="ts">
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { fly, fade } from 'svelte/transition';

    // Constants
    const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition";

    // State
    let step = $state(1); // 1: Akun, 2: Paket
    let isLoading = $state(false);
    let errorMessage = $state<string | null>(null);

    // Form Data
    let selectedPlan = $page.url.searchParams.get('plan') || 'basic';
    let form = $state({
        name: '',
        company_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan: selectedPlan
    });

    // --- LOGIC ---

    function nextStep() {
        errorMessage = null;
        // Validasi Sederhana Langkah 1
        if (!form.name || !form.company_name || !form.email || !form.password) {
            errorMessage = "Mohon lengkapi semua data diri.";
            return;
        }
        if (form.password !== form.password_confirmation) {
            errorMessage = "Konfirmasi password tidak cocok.";
            return;
        }
        if (form.password.length < 8) {
            errorMessage = "Password minimal 8 karakter.";
            return;
        }
        
        // Pindah ke Langkah 2
        step = 2;
    }

    function prevStep() {
        errorMessage = null;
        step = 1;
    }

    async function handleRegister() {
        isLoading = true;
        errorMessage = null;

        try {
            const res = await api('/auth/register', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            userState.login(res.token, res.user);
            goto('/merchant/dashboard');
        } catch (err: any) {
            errorMessage = err.message || 'Gagal mendaftar.';
            // Jika errornya validasi input, mungkin perlu balik ke step 1
            // Tapi untuk sekarang kita tampilkan saja errornya
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Daftar Merchant - Langkah {step} dari 2</title>
</svelte:head>

<div class="min-h-screen flex bg-white font-sans overflow-hidden">
    
    <div class="hidden lg:flex w-1/2 bg-brand-900 relative flex-col justify-between p-12 text-white">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
        
        <div class="relative z-10 flex items-center gap-3">
             <div class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 font-bold text-xl">Q</div>
            <span class="font-bold text-xl tracking-wide">QRVerify</span>
        </div>

        <div class="relative z-10 max-w-lg transition-all duration-500">
            {#if step === 1}
                <h2 in:fade class="text-4xl font-bold mb-6">Langkah 1: Identitas Bisnis</h2>
                <p class="text-brand-100 text-lg">Buat akun untuk mengelola dashboard dan memonitor produk Anda.</p>
            {:else}
                <h2 in:fade class="text-4xl font-bold mb-6">Langkah 2: Pilih Kapasitas</h2>
                <p class="text-brand-100 text-lg">Sesuaikan kuota QR Code dengan volume produksi pabrik Anda.</p>
            {/if}
        </div>

        <div class="relative z-10 flex gap-2">
            <div class={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-white' : 'bg-white/20'}`}></div>
            <div class={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}></div>
        </div>
    </div>

    <div class="w-full lg:w-1/2 flex flex-col justify-center bg-white relative">
        
        <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            {#if step === 2}
                <button onclick={prevStep} class="text-sm font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    Kembali
                </button>
            {:else}
                <a href="/" class="text-sm font-medium text-slate-500 hover:text-brand-600">Batal</a>
            {/if}
            
            <div class="flex gap-1 lg:hidden">
                <div class={`h-1.5 w-8 rounded-full transition ${step >= 1 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                <div class={`h-1.5 w-8 rounded-full transition ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
            </div>
        </div>

        <div class="w-full max-w-md mx-auto px-8 py-12 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar flex flex-col justify-center">
            
            {#if errorMessage}
                <div transition:fly={{ y: -20 }} class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>{errorMessage}</span>
                </div>
            {/if}

            {#if step === 1}
                <div in:fly={{ x: -20, duration: 300 }} class="space-y-6">
                    <div>
                        <h2 class="text-3xl font-extrabold text-slate-900">Buat Akun Merchant</h2>
                        <p class="mt-2 text-slate-500">Isi data penanggung jawab akun.</p>
                    </div>

                    <div class="space-y-5">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                <input bind:value={form.name} type="text" class={inputClass} placeholder="Budi Santoso">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">Nama Brand</label>
                                <input bind:value={form.company_name} type="text" class={inputClass} placeholder="Kopi XYZ">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Email Bisnis</label>
                            <input bind:value={form.email} type="email" class={inputClass} placeholder="admin@kopi-xyz.com">
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Password</label>
                            <input bind:value={form.password} type="password" class={inputClass} placeholder="Minimal 8 karakter">
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Password</label>
                            <input bind:value={form.password_confirmation} type="password" class={inputClass} placeholder="Ulangi password">
                        </div>
                    </div>

                    <button 
                        onclick={nextStep}
                        class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95 flex justify-center items-center gap-2"
                    >
                        Lanjut ke Pilih Paket
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                    
                    <div class="text-center text-sm text-slate-500">
                        Sudah punya akun? <a href="/login" class="font-bold text-brand-600 hover:underline">Masuk</a>
                    </div>
                </div>
            {/if}

            {#if step === 2}
                <div in:fly={{ x: 20, duration: 300 }} class="space-y-6">
                    <div>
                        <h2 class="text-3xl font-extrabold text-slate-900">Pilih Paket Langganan</h2>
                        <p class="mt-2 text-slate-500">Pilih kapasitas yang sesuai kebutuhan Anda.</p>
                    </div>

                    <div class="space-y-3">
                        <label class={`relative flex p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${form.plan === 'basic' ? 'border-brand-600 bg-brand-50' : 'border-slate-100 bg-white hover:border-brand-200'}`}>
                            <input type="radio" bind:group={form.plan} value="basic" class="sr-only">
                            <div class="flex-1">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-bold text-slate-900">Basic Plan</span>
                                    <span class="text-sm font-bold text-slate-600">Rp 150rb<span class="text-slate-400 text-xs font-normal">/bln</span></span>
                                </div>
                                <ul class="text-xs text-slate-500 space-y-1">
                                    <li>• Total Kuota: <strong>1.000 QR</strong></li>
                                    <li>• Max Batch: 100 QR/sekali</li>
                                </ul>
                            </div>
                            {#if form.plan === 'basic'}
                                <div class="absolute top-4 right-4 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                            {/if}
                        </label>

                        <label class={`relative flex p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${form.plan === 'pro' ? 'border-brand-600 bg-brand-50' : 'border-slate-100 bg-white hover:border-brand-200'}`}>
                            <input type="radio" bind:group={form.plan} value="pro" class="sr-only">
                            <div class="flex-1">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-bold text-slate-900">Pro Business</span>
                                    <span class="text-sm font-bold text-slate-600">Rp 450rb<span class="text-slate-400 text-xs font-normal">/bln</span></span>
                                </div>
                                <ul class="text-xs text-slate-500 space-y-1">
                                    <li>• Total Kuota: <strong>10.000 QR</strong></li>
                                    <li>• Max Batch: 1.000 QR/sekali</li>
                                    <li>• <strong>Custom Logo Branding</strong></li>
                                </ul>
                            </div>
                            {#if form.plan === 'pro'}
                                <div class="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">BEST VALUE</div>
                                <div class="absolute top-4 right-4 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                            {/if}
                        </label>

                        <label class={`relative flex p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${form.plan === 'enterprise' ? 'border-brand-600 bg-brand-50' : 'border-slate-100 bg-white hover:border-brand-200'}`}>
                            <input type="radio" bind:group={form.plan} value="enterprise" class="sr-only">
                            <div class="flex-1">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-bold text-slate-900">Enterprise</span>
                                    <span class="text-sm font-bold text-slate-600">Rp 1.2jt<span class="text-slate-400 text-xs font-normal">/bln</span></span>
                                </div>
                                <ul class="text-xs text-slate-500 space-y-1">
                                    <li>• Total Kuota: <strong>100.000 QR</strong></li>
                                    <li>• API Integration Access</li>
                                </ul>
                            </div>
                            {#if form.plan === 'enterprise'}
                                <div class="absolute top-4 right-4 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
                                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                            {/if}
                        </label>
                    </div>

                    <div class="pt-4 space-y-3">
                        <button 
                            onclick={handleRegister} 
                            disabled={isLoading}
                            class="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {#if isLoading}
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {:else}
                                Selesaikan Pendaftaran
                            {/if}
                        </button>

                        <p class="text-[10px] text-center text-slate-400 leading-tight">
                            Dengan mengklik tombol di atas, Anda menyetujui Penagihan Otomatis Bulanan dan Syarat & Ketentuan kami.
                        </p>
                    </div>
                </div>
            {/if}

        </div>
    </div>
</div>
<script lang="ts">
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';
    import { goto } from '$app/navigation';

    let email = $state('');
    let password = $state('');
    let isLoading = $state(false);
    let errorMessage = $state<string | null>(null);

    async function handleLogin(e: Event) {
        e.preventDefault();
        isLoading = true;
        errorMessage = null;

        try {
            const res = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            userState.login(res.token, res.user);
            
            if (res.user.role === 'admin') {
                goto('/admin/dashboard');
            } else {
                goto('/merchant/dashboard');
            }

        } catch (err: any) {
            errorMessage = err.message;
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Masuk - QRVerify Dashboard</title>
</svelte:head>

<div class="min-h-screen flex bg-white font-sans">
    
    <div class="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div class="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        
        <div class="relative z-10 flex items-center gap-3">
            <div class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 font-bold text-xl">Q</div>
            <span class="font-bold text-xl tracking-wide">QRVerify</span>
        </div>

        <div class="relative z-10 max-w-lg">
            <blockquote class="text-2xl font-medium leading-relaxed">
                "Keamanan brand adalah prioritas nomor satu. QRVerify memberikan kami kendali penuh atas distribusi produk di pasar."
            </blockquote>
            <div class="mt-6 flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600"></div>
                <div>
                    <div class="font-bold">Alex Santoso</div>
                    <div class="text-slate-400 text-sm">CEO, Kopi Nusantara</div>
                </div>
            </div>
        </div>

        <div class="relative z-10 text-sm text-slate-500">
            &copy; 2026 QRVerify System. All rights reserved.
        </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <a href="/" class="absolute top-8 right-8 text-sm font-medium text-slate-500 hover:text-brand-600 transition">Kembali ke Beranda</a>

        <div class="w-full max-w-md space-y-8">
            <div class="text-center lg:text-left">
                <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
                <p class="mt-2 text-slate-500">Masuk untuk mengelola batch QR Code Anda.</p>
            </div>

            {#if errorMessage}
                <div class="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 animate-pulse">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{errorMessage}</span>
                </div>
            {/if}

            <form class="space-y-6" onsubmit={handleLogin}>
                <div>
                    <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">Email Bisnis</label>
                    <input 
                        bind:value={email}
                        id="email" 
                        type="email" 
                        required 
                        class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                        placeholder="nama@perusahaan.com"
                    >
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label for="password" class="block text-sm font-semibold text-slate-700">Password</label>
                        <a href="#" class="text-sm font-medium text-brand-600 hover:text-brand-500">Lupa Password?</a>
                    </div>
                    <input 
                        bind:value={password}
                        id="password" 
                        type="password" 
                        required 
                        class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                        placeholder="••••••••"
                    >
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    class="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Memproses...
                    {:else}
                        Masuk Dashboard
                    {/if}
                </button>
            </form>

            <div class="text-center text-sm text-slate-500">
                Belum punya akun? 
                <a href="/register" class="font-bold text-brand-600 hover:text-brand-500">Daftar Merchant Gratis</a>
            </div>
        </div>
    </div>
</div>
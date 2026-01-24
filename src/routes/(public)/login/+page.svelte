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
            // 1. Request ke Backend Laravel
            // Endpoint: POST /auth/login (params: email, password)
            const res = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // 2. Simpan token & user ke UserState
            // Asumsi response Laravel: { token: "...", user: { ... } }
            userState.login(res.token, res.user);

            // 3. Redirect berdasarkan Role
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
    <title>Login - QRVerify</title>
</svelte:head>

<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[80vh]">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/30">
            Q
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Masuk ke Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Atau
            <a href="/" class="font-medium text-brand-600 hover:text-brand-500 transition">
                kembali ke beranda
            </a>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
            
            {#if errorMessage}
                <div class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    {errorMessage}
                </div>
            {/if}

            <form class="space-y-6" onsubmit={handleLogin}>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email address </label>
                    <div class="mt-1">
                        <input 
                            bind:value={email}
                            id="email" 
                            name="email" 
                            type="email" 
                            autocomplete="email" 
                            required 
                            class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition" 
                            placeholder="nama@perusahaan.com"
                        >
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1"> Password </label>
                    <div class="mt-1">
                        <input 
                            bind:value={password}
                            id="password" 
                            name="password" 
                            type="password" 
                            autocomplete="current-password" 
                            required 
                            class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition"
                            placeholder="••••••••"
                        >
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Ingat saya </label>
                    </div>

                    <a href="/register" class="px-8 py-4 bg-brand-600 text-white ...">
                        Daftar Sekarang
                    </a>
                </div>

                <div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {#if isLoading}
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        {:else}
                            Masuk
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
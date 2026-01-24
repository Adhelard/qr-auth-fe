<script lang="ts">
    import { api } from '$lib/services/api';
    import { userState } from '$lib/stores/user.svelte';
    import { goto } from '$app/navigation';

    let form = $state({
        name: '',
        company_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    
    let isLoading = $state(false);
    let errorMessage = $state<string | null>(null);

    async function handleRegister(e: Event) {
        e.preventDefault();
        isLoading = true;
        errorMessage = null;

        // Validasi sederhana di frontend
        if (form.password !== form.password_confirmation) {
            errorMessage = "Konfirmasi password tidak cocok.";
            isLoading = false;
            return;
        }

        try {
            // 1. Hit API Register
            const res = await api('/auth/register', {
                method: 'POST',
                body: JSON.stringify(form)
            });

            // 2. Auto Login (Simpan token)
            // Pastikan format response backend: { token: '...', user: {...} }
            userState.login(res.token, res.user);

            // 3. Redirect ke Dashboard
            goto('/merchant/dashboard');

        } catch (err: any) {
            // Menangkap error validasi dari Laravel
            // Laravel biasanya kirim error 422 dengan json { message: "...", errors: {...} }
            errorMessage = err.message || 'Gagal mendaftar. Silakan cek data Anda.';
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>Daftar Merchant Baru - QRVerify</title>
</svelte:head>

<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[80vh]">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/30">
            Q
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Gabung Sebagai Merchant
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Sudah punya akun?
            <a href="/login" class="font-medium text-brand-600 hover:text-brand-500 transition">
                Masuk di sini
            </a>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
            
            {#if errorMessage}
                <div class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    {errorMessage}
                </div>
            {/if}

            <form class="space-y-5" onsubmit={handleRegister}>
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input bind:value={form.name} id="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Budi Santoso">
                </div>

                <div>
                    <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan / Brand</label>
                    <input bind:value={form.company_name} id="company" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="PT Maju Mundur">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input bind:value={form.email} id="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="email@perusahaan.com">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input bind:value={form.password} id="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                    <input bind:value={form.password_confirmation} id="password_confirmation" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                </div>

                <div class="flex items-center">
                    <input id="terms" name="terms" type="checkbox" required class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded">
                    <label for="terms" class="ml-2 block text-sm text-gray-900">
                        Saya setuju dengan <a href="#" class="text-brand-600 hover:text-brand-500">Syarat & Ketentuan</a>
                    </label>
                </div>

                <div>
                    <button type="submit" disabled={isLoading} class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-all">
                        {#if isLoading}
                            Mendaftarkan...
                        {:else}
                            Daftar Sekarang
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
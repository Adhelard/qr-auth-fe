<script lang="ts">
    import { onMount } from 'svelte';
    import { userState } from '$lib/stores/user.svelte';
    import { goto } from '$app/navigation';
    import MerchantSidebar from '$lib/components/Layout/MerchantSidebar.svelte';

    let { children } = $props();
    let isChecking = $state(true);

    onMount(() => {
        // --- DEBUG START ---
        console.log("Current User State:", userState.user);
        // Cek apakah role terbaca?
        // --- DEBUG END ---

        // Cek Keamanan Sederhana (Client-side)
        if (!userState.isAuthenticated) {
            goto('/login');
        } 
        // Tambahkan optional chaining (?) yang aman
        else if (userState.user?.role !== 'merchant') {
            
            // DEBUG: Tampilkan pesan error yang lebih jelas
            console.error("Role mismatch. Expected 'merchant', got:", userState.user?.role);
            
            alert('Akses ditolak. Area khusus Merchant. Role anda: ' + (userState.user?.role || 'Tidak terbaca'));
            goto('/'); 
        } else {
            isChecking = false;
        }
    });
</script>

{#if isChecking}
    <div class="h-screen w-full flex items-center justify-center bg-gray-50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
    </div>
{:else}
    <div class="min-h-screen bg-gray-50 font-sans">
        <MerchantSidebar />

        <div class="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
            <header class="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                <span class="font-bold text-gray-800">QRVerify Merchant</span>
                <button class="text-gray-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </header>

            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                {@render children()}
            </main>
        </div>
    </div>
{/if}
<script lang="ts">
    import { page } from '$app/stores';
    import { userState } from '$lib/stores/user.svelte';
    import { goto } from '$app/navigation';

    // Helper untuk cek link aktif
    let currentPath = $derived($page.url.pathname);
    function isActive(path: string) {
        return currentPath.startsWith(path);
    }

    function handleLogout() {
        if(confirm('Yakin ingin keluar?')) {
            userState.logout();
            goto('/login');
        }
    }
</script>

<aside class="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col fixed inset-y-0 z-10">
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">Q</div>
        <span class="font-bold text-gray-800 text-lg">Merchant Panel</span>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        
        <a href="/merchant/dashboard" 
           class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {isActive('/merchant/dashboard') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
        </a>

        <a href="/merchant/products" 
           class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {isActive('/merchant/products') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Produk
        </a>

        <a href="/merchant/qr-batches" 
           class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {isActive('/merchant/qr-batches') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 8v4M6 16v4" /></svg>
            QR Batches
        </a>

        <a href="/merchant/profile" 
           class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {isActive('/merchant/profile') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profil Perusahaan
        </a>

    </nav>

    <div class="p-4 border-t border-gray-200">
        <button onclick={handleLogout} class="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar
        </button>
    </div>
</aside>
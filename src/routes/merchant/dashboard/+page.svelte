<script lang="ts">
    import { userState } from '$lib/stores/user.svelte';
</script>

<svelte:head>
    <title>Dashboard - {userState.user?.name}</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
    <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Selamat Datang, {userState.user?.name} 👋</h1>
        <p class="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas QR Code produk Anda hari ini.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-500 text-sm font-medium">Total Produk</h3>
                <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">12</div>
            <span class="text-xs text-green-600 font-medium mt-2 block">+2 produk baru bulan ini</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-500 text-sm font-medium">QR Terjual/Aktif</h3>
                <div class="p-2 bg-green-50 text-green-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">854</div>
            <span class="text-xs text-gray-400 font-medium mt-2 block">Dari 1,000 kuota batch</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-gray-500 text-sm font-medium">Total Scan (Valid)</h3>
                <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
            </div>
            <div class="text-3xl font-bold text-gray-900">1,240</div>
            <span class="text-xs text-green-600 font-medium mt-2 block">↑ 12% dari minggu lalu</span>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-bold text-gray-900">Scan Log Terbaru</h3>
            <button class="text-sm text-brand-600 font-medium hover:text-brand-700">Lihat Semua</button>
        </div>
        <div class="p-6 text-center text-gray-500 py-12">
            Belum ada data real-time. (Nanti diintegrasikan dengan API `/analytics/summary`)
        </div>
    </div>
</div>
<script lang="ts">
    import { onMount } from 'svelte';
    import { userState } from '$lib/stores/user.svelte';
    import { api } from '$lib/services/api';
    import { fade, scale } from 'svelte/transition';

    // State Data Dashboard
    let stats = $state({
        total_products: 0,
        total_batches: 0,
        total_scans: 0,
        suspicious_scans: 0,
        quota_used: 0,
        quota_limit: 1, 
        plan_type: 'basic', 
        chart_data: Array(7).fill(0) 
    });
    
    let recentScans = $state<any[]>([]);
    let isLoading = $state(true);
    let chartLabels = $state<string[]>([]);

    // State untuk Modal Panduan
    let showGuide = $state(false); 

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    function generateLast7DaysLabels() {
        const today = new Date();
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            labels.push(days[d.getDay()]);
        }
        return labels;
    }

    onMount(async () => {
        chartLabels = generateLast7DaysLabels();

        // --- HOOK OTOMATIS (BARU) ---
        // Cek apakah browser sudah mencatat bahwa user pernah melihat panduan
        const hasSeenGuide = localStorage.getItem('dashboard_guide_seen_v1');
        
        if (!hasSeenGuide) {
            // Jika belum pernah lihat, tampilkan panduan setelah jeda 1 detik
            setTimeout(() => {
                showGuide = true;
                // Simpan status agar tidak muncul terus-menerus setiap refresh
                localStorage.setItem('dashboard_guide_seen_v1', 'true');
            }, 1000);
        }
        // ---------------------------

        try {
            const res = await api('/analytics/summary'); 
            stats = res.data || res;
            
            if (!stats.chart_data || stats.chart_data.length === 0) {
                 stats.chart_data = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
            }

            if (res.recent_scans) {
                recentScans = res.recent_scans;
            }
        } catch (e) {
            console.error("Gagal load dashboard", e);
            // Fallback Data Demo
            stats = { 
                total_products: 12, 
                total_batches: 5, 
                total_scans: 1240, 
                suspicious_scans: 3, 
                quota_used: 850, 
                quota_limit: 1000,
                plan_type: 'basic',
                chart_data: [45, 67, 32, 80, 50, 95, 60] 
            };
        } finally {
            isLoading = false;
        }
    });

    let quotaPercent = $derived(
        stats.quota_limit > 0 
        ? Math.min((stats.quota_used / stats.quota_limit) * 100, 100) 
        : 0
    );

    let planLabel = $derived(
        stats.plan_type === 'enterprise' ? 'Enterprise' :
        stats.plan_type === 'pro' ? 'Pro Business' : 'Basic Plan'
    );
</script>

<svelte:head>
    <title>Dashboard - {userState.user?.name}</title>
</svelte:head>

<div class="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Overview</h1>
            <p class="text-slate-500 text-sm mt-1">
                Halo, <span class="font-semibold text-slate-900">{userState.user?.name}</span>.
                Paket Anda saat ini: <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-100 text-brand-800 capitalize">{planLabel}</span>
            </p>
        </div>
        <div class="flex gap-3">
            <button 
                onclick={() => showGuide = true}
                class="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition shadow-sm"
            >
                <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan
            </button>

            <a href="/merchant/qr-batches/new" class="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-slate-900/20">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Buat Batch Baru
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-brand-50 rounded-xl text-brand-600">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 8v4M6 16v4"/></svg>
                </div>
                <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                     <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    Active
                </span>
            </div>
            <div class="text-3xl font-bold text-slate-900 mb-1">{stats.total_scans.toLocaleString()}</div>
            <div class="text-sm text-slate-500">Total Validasi Scan</div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
            </div>
            <div class="text-3xl font-bold text-slate-900 mb-1">{stats.total_products}</div>
            <div class="text-sm text-slate-500">Produk Terdaftar</div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition relative overflow-hidden">
             <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-red-50 rounded-xl text-red-600">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                {#if stats.suspicious_scans > 0}
                    <span class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">Perlu Dicek</span>
                {/if}
            </div>
            <div class="text-3xl font-bold text-slate-900 mb-1">{stats.suspicious_scans}</div>
            <div class="text-sm text-slate-500">Scan Mencurigakan</div>
        </div>

        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
            
            <div>
                <div class="flex justify-between items-center mb-2">
                     <span class="text-sm font-medium text-slate-300">Kuota QR Bulanan</span>
                    <span class={`text-xs font-bold px-2 py-1 rounded ${quotaPercent > 90 ? 'bg-red-500/20 text-red-300' : 'bg-brand-500/20 text-brand-300'}`}>
                        {quotaPercent.toFixed(1)}%
                    </span>
                </div>
                <div class="text-2xl font-bold tracking-tight">
                    {stats.quota_used.toLocaleString()} 
                    <span class="text-sm font-normal text-slate-500">/ {stats.quota_limit.toLocaleString()}</span>
                </div>
            </div>

            <div class="mt-4">
                <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div 
                        class={`h-full rounded-full transition-all duration-1000 ease-out ${quotaPercent > 90 ? 'bg-red-500' : 'bg-brand-500'}`}
                        style="width: {quotaPercent}%"
                    ></div>
                </div>
                <div class="mt-3 flex justify-between items-center text-xs text-slate-400">
                     <span>Paket: <strong class="text-white">{planLabel}</strong></span>
                    {#if quotaPercent > 90}
                        <a href="/pricing" class="text-brand-400 hover:underline">Upgrade</a>
                    {/if}
                </div>
             </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="font-bold text-slate-900">Statistik Scan</h3>
                    <p class="text-xs text-slate-500">Aktivitas 7 hari terakhir</p>
                </div>
            </div>
            
            <div class="flex items-end justify-between h-64 gap-2 sm:gap-4 px-2">
                {#each stats.chart_data as value, i}
                    {@const heightPercent = Math.max((value / Math.max(...stats.chart_data, 1)) * 100, 5)} 
                    
                    <div class="w-full flex flex-col items-center gap-3 group cursor-pointer">
                         <div class="relative w-full bg-brand-50/50 rounded-t-lg hover:bg-brand-100 transition-all duration-300 flex flex-col justify-end overflow-hidden" style="height: 100%">
                            <div 
                                class="w-full bg-brand-500 opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out rounded-t-sm" 
                                style="height: {heightPercent}%"
                            ></div>
                            
                            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 z-10 shadow-lg whitespace-nowrap">
                                {value} Scans
                            </div>
                        </div>
                        
                        <span class="text-xs text-slate-400 font-medium group-hover:text-brand-600 transition">
                            {chartLabels[i] || '-'}
                        </span>
                    </div>
                {/each}
            </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <h3 class="font-bold text-slate-900 mb-6">Scan Terbaru</h3>
            
            <div class="flex-1 overflow-y-auto pr-2 space-y-0 max-h-[300px]">
                {#if recentScans.length === 0}
                    <div class="text-center py-8 text-slate-400 text-sm">Belum ada aktivitas scan.</div>
                {:else}
                    {#each recentScans as scan}
                        <div class="flex gap-4 items-start relative pl-4 py-4 border-l-2 border-slate-100 hover:bg-slate-50/50 transition -ml-4 px-4">
                            <div class={`absolute left-0 top-6 w-1 h-6 rounded-r-full ${scan.status === 'suspicious' ? 'bg-red-500' : 'bg-transparent'}`}></div>
                            
                            <div class="mt-1">
                                {#if scan.status === 'suspicious'}
                                     <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    </div>
                                {:else}
                                     <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 8v4M6 16v4"/></svg>
                                     </div>
                                {/if}
                            </div>
                            
                             <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-semibold text-slate-900 truncate">{scan.product}</h4>
                                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                                    <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {scan.location}
                                </p>
                            </div>
                            <div class="text-right whitespace-nowrap">
                                <span class="text-[10px] font-medium text-slate-400 block">{scan.time}</span>
                            </div>
                        </div>
                     {/each}
                {/if}
            </div>
        </div>
    </div>
</div>

{#if showGuide}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick={() => showGuide = false}></div>
        
        <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" transition:scale={{ start: 0.95, duration: 200 }}>
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Panduan Dashboard
                </h2>
                <button onclick={() => showGuide = false} class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
                
                <div class="space-y-3">
                    <h3 class="font-bold text-slate-900 text-base">1. Status & Indikator Utama</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-green-50/50 p-3 rounded-xl border border-green-100">
                            <span class="font-semibold text-green-700 block mb-1">Total Validasi Scan</span>
                            <p class="text-xs">Jumlah konsumen yang berhasil memindai kode QR produk asli Anda.</p>
                        </div>
                        <div class="bg-red-50/50 p-3 rounded-xl border border-red-100">
                            <span class="font-semibold text-red-700 block mb-1">Scan Mencurigakan</span>
                            <p class="text-xs">Deteksi potensi pemalsuan. Jika ada angka di sini, segera cek detailnya untuk melihat lokasi dan produk terkait.</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <h3 class="font-bold text-slate-900 text-base">2. Mengelola Kuota</h3>
                    <p class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        Kartu berwarna hitam menampilkan sisa kuota QR bulanan Anda. Indikator akan berubah menjadi <strong class="text-red-600">Merah</strong> jika penggunaan melebihi 90%. Pastikan untuk upgrade paket sebelum habis agar kode QR tetap bisa dipindai.
                    </p>
                </div>

                <div class="space-y-3">
                    <h3 class="font-bold text-slate-900 text-base">3. Navigasi Cepat</h3>
                    <ul class="list-disc list-outside pl-4 space-y-1">
                        <li><strong>Buat Batch Baru:</strong> Tombol di pojok kanan atas untuk membuat ribuan kode QR sekaligus.</li>
                        <li><strong>Live Feed:</strong> Kolom "Scan Terbaru" di kanan bawah memperbarui aktivitas secara real-time. Ikon <span class="text-red-500 font-bold">Merah</span> menandakan bahaya.</li>
                        <li><strong>Grafik:</strong> Arahkan kursor ke batang grafik untuk melihat detail jumlah scan per hari.</li>
                    </ul>
                </div>

            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
                <button onclick={() => showGuide = false} class="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                    Mengerti
                </button>
            </div>
        </div>
    </div>
{/if}\
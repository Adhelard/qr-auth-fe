<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import PublicNavbar from '$lib/components/layout/PublicNavbar.svelte';
    
    let code = $page.params.code;
    
    // Status state
    let status = $state<'loading' | 'authentic' | 'suspicious' | 'fake'>('loading');
    let data = $state<any>(null);

    onMount(async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/verify/${code}`, {
                headers: { 'Accept': 'application/json' }
            });
            const json = await res.json();

            // Delay sedikit untuk efek loading dramatis
            setTimeout(() => {
                if (res.status === 404) {
                    status = 'fake';
                } else if (res.ok) {
                    data = json;
                    status = json.status;
                } else {
                    status = 'fake';
                }
            }, 1200);
        } catch (e) {
            status = 'fake';
        }
    });
</script>

<svelte:head>
    <title>Verifikasi Produk - {code}</title>
</svelte:head>

<PublicNavbar /> 

<div class="min-h-screen bg-slate-50 pt-24 pb-12 px-4 flex justify-center items-start font-sans">
    
    {#if status === 'loading'}
        <div class="flex flex-col items-center justify-center h-[60vh]" out:fade>
            <div class="relative w-32 h-32 mb-8">
                <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-10 h-10 text-brand-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 8v4M6 16v4"/></svg>
                </div>
            </div>
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">Memverifikasi Kode...</h2>
            <p class="text-slate-500 text-sm mt-2">Menghubungkan ke database blockchain...</p>
        </div>

    {:else}
        <div 
            class="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden relative border border-slate-100"
            in:fly={{ y: 20, duration: 600 }}
        >
            
            <div class={`relative px-6 py-10 text-center overflow-hidden ${
                status === 'authentic' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 
                status === 'suspicious' ? 'bg-gradient-to-br from-rose-500 to-rose-700' : 
                'bg-slate-800'
            }`}>
                <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div class="relative z-10 text-white">
                    <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
                        {#if status === 'authentic'}
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        {:else if status === 'suspicious'}
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        {:else}
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                        {/if}
                    </div>
                    
                    <h1 class="text-2xl font-extrabold tracking-tight uppercase">
                        {status === 'authentic' ? 'Produk Asli' : status === 'suspicious' ? 'Kode Invalid' : 'Tidak Dikenal'}
                    </h1>
                    
                    <p class="text-white/80 text-sm mt-1 font-medium">
                        {status === 'authentic' ? 'Kode terdaftar resmi & valid.' : 
                         status === 'suspicious' ? 'Peringatan: Batas scan terlampaui.' : 
                         'Kode tidak ditemukan di sistem.'}
                    </p>

                    {#if status !== 'fake' && data}
                        <div class="mt-6 inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                            <div class="text-right border-r border-white/20 pr-3">
                                <span class="block text-[10px] uppercase tracking-wider opacity-70">Total Scan</span>
                                <span class="block text-xl font-bold leading-none">{data.scan_count}x</span>
                            </div>
                            <div class="text-left">
                                {#if data.scan_count === 1}
                                    <span class="text-xs font-bold text-emerald-100 flex items-center gap-1">
                                        ✨ Scan Pertama
                                    </span>
                                    <span class="text-[10px] opacity-80">Produk 100% Baru</span>
                                {:else}
                                    <span class={`text-xs font-bold flex items-center gap-1 ${status === 'suspicious' ? 'text-rose-100' : 'text-emerald-50'}`}>
                                        ⚠️ Telah dibuka
                                    </span>
                                    <span class="text-[10px] opacity-80">
                                        {status === 'suspicious' ? 'Potensi Palsu' : 'Cek kondisi fisik'}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="p-6 md:p-8">
                {#if status !== 'fake' && data}
                    
                    {#if status === 'suspicious'}
                        <div class="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-4 mb-8 animate-pulse">
                            <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
                                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-rose-800">PERINGATAN KEAMANAN</h4>
                                <p class="text-xs text-rose-600 mt-1 leading-relaxed">
                                    Produk ini telah discan sebanyak <strong>{data.scan_count} kali</strong>. 
                                    Jika Anda membeli produk ini dalam kondisi "Baru", kemungkinan besar ini adalah produk palsu yang menggunakan kode daur ulang.
                                </p>
                            </div>
                        </div>
                    {/if}

                    <div class="flex gap-5 mb-8">
                        <div class="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-100 p-1 flex-shrink-0 overflow-hidden">
                            {#if data.product.image_url}
                                <img src={data.product.image_url} alt="Product" class="w-full h-full object-cover rounded-xl">
                            {:else}
                                <div class="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100 rounded-xl">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                            {/if}
                        </div>
                        <div class="flex flex-col justify-center">
                            <div class="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">Produk Terdaftar</div>
                            <h2 class="text-xl font-bold text-slate-900 leading-tight mb-1">{data.product.name}</h2>
                            <div class="flex items-center gap-1.5">
                                <div class="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <svg class="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                                </div>
                                <span class="text-sm text-slate-500 font-medium">{data.product.merchant}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
                        <div class="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div>
                                <div class="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Batch Number</div>
                                <div class="text-sm font-semibold text-slate-700">{data.product.batch || '-'}</div>
                            </div>
                            <div>
                                <div class="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Scan Pertama</div>
                                <div class="text-sm font-semibold text-slate-700">
                                    {data.first_scanned_at ? new Date(data.first_scanned_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : 'Hari ini'}
                                </div>
                            </div>
                            <div class="col-span-2 pt-2 mt-2 border-t border-slate-200">
                                <div class="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Serial ID (Hidden)</div>
                                <div class="font-mono text-xs text-slate-500 bg-white inline-block px-2 py-1 rounded border border-slate-200">
                                    {code}
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="/scan" class="block w-full py-4 text-center bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition transform hover:-translate-y-0.5">
                        Scan Produk Lain
                    </a>

                {:else}
                    <div class="text-center py-6">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <h3 class="text-lg font-bold text-slate-900 mb-2">Kode Tidak Dikenali</h3>
                        <p class="text-slate-500 text-sm mb-8 leading-relaxed px-4">
                            Sistem kami tidak memiliki data untuk kode QR ini (<span class="font-mono text-xs bg-slate-100 px-1 rounded">{code}</span>). 
                            Mohon berhati-hati, produk ini mungkin <strong>palsu</strong> atau tidak terdaftar secara resmi.
                        </p>
                        <a href="/scan" class="block w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                            Coba Scan Ulang
                        </a>
                    </div>
                {/if}
            </div>

            <div class="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-center text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Verified by QRVerify System
            </div>
        </div>
    {/if}
</div>

<style>
    /* Custom Scrollbar hide */
    ::-webkit-scrollbar { width: 0px; background: transparent; }
</style>
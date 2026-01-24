<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';

    let code = $page.params.code;
    
    // State UI
    let status = $state<'loading' | 'authentic' | 'suspicious' | 'fake'>('loading');
    let data = $state<any>(null);

    onMount(async () => {
        try {
            // Panggil API Public (tanpa token user)
            // Kita pakai fetch biasa karena 'api' wrapper kita mungkin memaksa logout jika 401
            // Tapi endpoint ini public, jadi aman pakai wrapper jika sudah dihandle.
            // Untuk aman, kita fetch manual ke localhost/api/verify
            
            const res = await fetch(`http://localhost:8000/api/verify/${code}`, {
                headers: { 'Accept': 'application/json' }
            });
            
            const json = await res.json();

            if (res.status === 404) {
                status = 'fake';
            } else if (res.ok) {
                data = json;
                status = json.status; // 'authentic' or 'suspicious'
            } else {
                alert('Terjadi kesalahan server');
            }
        } catch (e) {
            console.error(e);
            status = 'fake'; // Asumsi error koneksi/404
        }
    });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    
    {#if status === 'loading'}
        <div class="animate-bounce mb-4">
            <div class="w-16 h-16 bg-brand-600 rounded-2xl mx-auto"></div>
        </div>
        <p class="text-gray-500 font-medium">Memverifikasi Kode Produk...</p>

    {:else if status === 'authentic'}
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-green-500">
            <div class="bg-green-50 p-8 text-center">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h1 class="text-2xl font-extrabold text-green-700">Produk Asli</h1>
                <p class="text-green-600 text-sm mt-1">Terverifikasi oleh Sistem QRVerify</p>
            </div>
            
            <div class="p-8">
                <div class="flex gap-4 mb-6">
                    {#if data.product.image_url}
                        <img src={data.product.image_url} alt="Product" class="w-24 h-24 rounded-xl object-cover border border-gray-100 shadow-sm">
                    {:else}
                        <div class="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    {/if}
                    <div>
                        <h2 class="font-bold text-gray-900 text-lg">{data.product.name}</h2>
                        <p class="text-gray-500 text-sm">{data.product.merchant}</p>
                        <div class="mt-2 inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                            {data.product.sku}
                        </div>
                    </div>
                </div>

                <div class="space-y-3 border-t border-gray-100 pt-6 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Serial Number</span>
                        <span class="font-mono text-gray-900 font-medium">{code}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Scan Ke-</span>
                        <span class="font-bold text-gray-900">{data.scan_count}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Scan Pertama</span>
                        <span class="text-gray-900">{new Date(data.first_scanned_at).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="mt-8 text-center text-xs text-gray-400">
                    Batch ID: {data.product.batch}
                </div>
            </div>
        </div>

    {:else if status === 'suspicious'}
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-amber-500">
            <div class="bg-amber-50 p-8 text-center">
                <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h1 class="text-2xl font-extrabold text-amber-700">Peringatan Keamanan</h1>
                <p class="text-amber-600 text-sm mt-1">Kode ini sudah dipindai terlalu sering.</p>
            </div>
            
            <div class="p-8">
                <p class="text-gray-600 text-center mb-6">
                    Kode QR ini valid, tetapi telah dipindai sebanyak <span class="font-bold text-red-600 text-lg">{data.scan_count} kali</span>.
                    Ada kemungkinan produk ini adalah duplikat atau kode QR telah disalin.
                </p>
                <div class="bg-gray-50 p-4 rounded-xl flex gap-3">
                     <div class="flex-1">
                         <div class="text-xs text-gray-500">Produk Seharusnya:</div>
                         <div class="font-bold text-gray-900">{data.product.name}</div>
                     </div>
                 </div>
            </div>
        </div>

    {:else}
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-red-600">
            <div class="bg-red-50 p-8 text-center">
                <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </div>
                <h1 class="text-2xl font-extrabold text-red-700">Produk Tidak Dikenali</h1>
                <p class="text-red-600 text-sm mt-1">Waspada Produk Palsu!</p>
            </div>
            
            <div class="p-8 text-center">
                <p class="text-gray-600 mb-6">
                    Kode QR <span class="font-mono bg-red-50 text-red-600 px-1 rounded">{code}</span> tidak terdaftar di database kami. 
                    Mohon berhati-hati sebelum membeli atau menggunakan produk ini.
                </p>
                <a href="/" class="text-brand-600 font-bold hover:underline">Kembali ke Beranda</a>
            </div>
        </div>
    {/if}

    <div class="mt-8 text-center">
        <a href="/scan" class="text-gray-500 text-sm flex items-center gap-2 hover:text-brand-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
            Scan Kode Lain
        </a>
    </div>
</div>
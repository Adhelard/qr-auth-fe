<script lang="ts">
    import { onMount } from 'svelte';
    // Bisa import icon dari lucide-svelte jika sudah diinstall,
    // tapi disini saya pakai SVG inline biar langsung jalan.
</script>

<svelte:head>
    <title>QRVerify - Lindungi Produk Anda dari Pemalsuan</title>
</svelte:head>

<section class="relative pt-20 pb-32 overflow-hidden">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100 via-gray-50 to-white opacity-70"></div>
    
    <div class="container-center text-center">
        <span class="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 border border-brand-100">
            🛡️ Solusi Anti-Counterfeit #1
        </span>
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Pastikan Keaslian Produk <br class="hidden md:block" />
            <span class="text-brand-600">Hanya Dalam Satu Scan.</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem verifikasi berbasis QR Code aman yang membantu produsen melindungi brand dan memberikan ketenangan bagi konsumen.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/login" class="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-brand-500/25 hover:-translate-y-1 transition-all duration-300">
                Mulai Sebagai Merchant
            </a>
            <a href="/scan" class="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                Cek Validasi (Demo)
            </a>
        </div>

        <div class="mt-16 relative mx-auto max-w-4xl">
            <div class="aspect-[16/9] bg-gray-900 rounded-2xl shadow-2xl border-4 border-gray-200/50 flex items-center justify-center overflow-hidden">
                <div class="text-gray-500 text-center">
                    <p class="text-2xl font-mono text-brand-400">Dashboard Preview</p>
                    <p class="text-sm mt-2">Realtime Scan Map & Analytics</p>
                    </div>
            </div>
            <div class="absolute -top-10 -right-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl -z-10"></div>
            <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
        </div>
    </div>
</section>

<section id="features" class="py-24 bg-white">
    <div class="container-center">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Mengapa Memilih Kami?</h2>
            <p class="text-gray-600">Teknologi enkripsi modern untuk memastikan setiap produk yang keluar dari pabrik Anda terlindungi hingga ke tangan konsumen.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition group">
                <div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Keamanan Terjamin</h3>
                <p class="text-gray-600 leading-relaxed">Setiap QR Code memiliki unique string yang dienkripsi dan hanya bisa divalidasi oleh sistem kami.</p>
            </div>

            <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition group">
                <div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Batch Generation</h3>
                <p class="text-gray-600 leading-relaxed">Generate ribuan QR code dalam hitungan detik berdasarkan Batch Produksi Anda.</p>
            </div>

            <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition group">
                <div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Analitik Real-time</h3>
                <p class="text-gray-600 leading-relaxed">Lacak lokasi scan (Kota, IP) untuk mendeteksi distribusi ilegal atau area penjualan tertinggi.</p>
            </div>
        </div>
    </div>
</section>

<section class="py-20 bg-gray-900 text-white">
    <div class="container-center text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Siap Melindungi Brand Anda?</h2>
        <p class="text-gray-400 mb-10 max-w-2xl mx-auto">Bergabunglah dengan merchant lain yang telah menggunakan sistem verifikasi kami.</p>
        <a href="/register" class="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition inline-block">
            Daftar Sekarang
        </a>
    </div>
</section>
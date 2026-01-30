<script lang="ts">
    import PublicNavbar from '$lib/components/Layout/PublicNavbar.svelte';
    import GDB from '$lib/assets/db.png' // Pastikan file ini ada atau ganti pathnya
    
    // Data untuk FAQ (Agar code lebih bersih)
    const faqs = [
        { q: "Apakah kode QR bisa dipalsukan?", a: "Sistem QRVerify menggunakan enkripsi dinamis dan tracking lokasi. Jika ada yang mencoba menyalin kode QR, sistem akan mendeteksi anomali scan ganda (double scan) dari lokasi berbeda dan menandainya sebagai mencurigakan secara real-time." },
        { q: "Apakah bisa terintegrasi dengan sistem pabrik?", a: "Tentu. Paket Enterprise kami menyediakan API Access yang bisa dihubungkan langsung ke sistem ERP atau lini produksi Anda untuk generate Batch ID secara otomatis." },
        { q: "Bagaimana cara konsumen melakukan verifikasi?", a: "Konsumen cukup menggunakan kamera HP bawaan atau aplikasi scanner apa saja. Tidak perlu download aplikasi khusus. Mereka akan diarahkan ke halaman verifikasi aman milik brand Anda." },
        { q: "Berapa lama masa aktif kode QR?", a: "Kode QR aktif selamanya selama langganan Anda aktif. Untuk paket Enterprise, kami menawarkan retensi data hingga 5 tahun." }
    ];
</script>

<svelte:head>
    <title>QRVerify - Platform Proteksi Keaslian Produk</title>
    <meta name="description" content="Lindungi brand Anda dari pemalsuan. Platform manajemen QR Code aman untuk manufaktur dan retail." />
</svelte:head>

<div class="relative overflow-hidden bg-slate-50">
    <PublicNavbar />

    <div class="absolute top-0 -left-4 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
    
    <section class="relative pt-40 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-[fadeIn_1s_ease-out]">
            <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-xs font-bold text-slate-600 tracking-wide uppercase">Telah memverifikasi 1M+ Produk</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
            Stop Pemalsuan Produk.<br/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">Jaga Reputasi Brand.</span>
        </h1>

        <p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform manajemen QR Code cerdas untuk memvalidasi keaslian, melacak distribusi, dan meningkatkan kepercayaan konsumen secara real-time.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/register" class="px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-2xl hover:shadow-brand-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center">
                Mulai Langganan
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
            <a href="/scan" class="px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all flex items-center gap-2 w-full sm:w-auto justify-center group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 8v4M6 16v4"/></svg>
                Scan produk mu!
            </a>
        </div>

        <div class="relative max-w-5xl mx-auto perspective-1000">
            <div class="relative bg-slate-900 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-700 p-3 transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out group">
                <img src={GDB} alt="Dashboard Preview" class="rounded-lg w-full h-auto opacity-90 transition duration-500 border border-slate-800" />
                
                <div class="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 animate-float hidden md:block">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div class="text-left">
                            <div class="text-xs text-slate-500 font-bold uppercase">Status</div>
                            <div class="font-bold text-slate-900">Produk Autentik</div>
                        </div>
                    </div>
                </div>

                <div class="absolute -left-8 bottom-20 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 animate-float animation-delay-2000 hidden md:block">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div class="text-left">
                            <div class="text-xs text-slate-500 font-bold uppercase">Lokasi Scan</div>
                            <div class="font-bold text-slate-900">Jakarta Selatan</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-10 border-y border-slate-200 bg-white">
        <div class="container mx-auto px-6 text-center">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Dipercaya oleh brand modern</p>
            <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <h3 class="text-xl font-bold font-serif text-slate-800">KOPIKENANGAN</h3>
                <h3 class="text-xl font-black italic text-slate-800">Erigo.</h3>
                <h3 class="text-xl font-bold text-slate-800 tracking-tighter">SOMETHINC</h3>
                <h3 class="text-xl font-semibold text-slate-800">Avoskin</h3>
            </div>
        </div>
    </section>

    <section id="features" class="py-24 bg-slate-50">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16 max-w-3xl mx-auto">
                <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Teknologi Keamanan Tingkat Lanjut</h2>
                <p class="text-slate-500 text-lg">Bukan sekadar QR Code biasa. Kami memberikan lapisan keamanan digital dan data analitik untuk setiap unit produk Anda.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div class="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 hover:shadow-xl transition group relative overflow-hidden">
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 text-brand-600">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-900 mb-3">Smart Batch Generator</h3>
                        <p class="text-slate-500 max-w-md text-lg leading-relaxed">
                            Generate hingga 100.000 QR unik per batch dalam hitungan detik. 
                            Download format ZIP siap cetak yang kompatibel dengan mesin printing industri.
                        </p>
                    </div>
                    <div class="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-brand-50 to-transparent rounded-tl-full group-hover:scale-110 transition duration-500"></div>
                </div>

                <div class="md:row-span-2 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">Distribusi Map</h3>
                        <p class="text-slate-400 leading-relaxed">
                            Pantau pergerakan produk secara global. Deteksi "Grey Market" jika produk dijual di luar wilayah yang ditentukan.
                        </p>
                    </div>
                    
                    <div class="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                        <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                            <span class="text-xs font-bold text-slate-300 uppercase">Live Feed</span>
                            <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span>Jakarta, ID</span>
                                <span class="text-green-400 font-mono">Just now</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Surabaya, ID</span>
                                <span class="text-slate-400 font-mono">2m ago</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Medan, ID</span>
                                <span class="text-slate-400 font-mono">5m ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:shadow-xl transition group">
                    <div class="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Custom Branding</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">Tampilkan Logo dan Warna brand Anda pada halaman verifikasi konsumen.</p>
                </div>

                <div class="bg-gradient-to-br from-brand-500 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-lg relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div class="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Anti-Counterfeit</h3>
                    <p class="text-brand-100 text-sm leading-relaxed">Sistem mendeteksi jika 1 QR Code yang sama discan berlebihan (duplikat).</p>
                </div>
            </div>
        </div>
    </section>

    <section id="process" class="py-24 bg-white border-y border-slate-100">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Mudah Diimplementasikan</h2>
                <p class="text-slate-500">Hanya butuh 3 langkah untuk mengamankan produk Anda.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div class="text-center relative">
                    <div class="w-16 h-16 mx-auto bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-900 mb-6 relative z-10">1</div>
                    <div class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-100 -z-0"></div>
                    
                    <h3 class="text-lg font-bold text-slate-900 mb-2">Buat Batch QR</h3>
                    <p class="text-slate-500 text-sm px-4">Login ke dashboard, input detail produk, dan generate ribuan kode unik dalam satu klik.</p>
                </div>

                <div class="text-center relative">
                    <div class="w-16 h-16 mx-auto bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-900 mb-6 relative z-10">2</div>
                    <div class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-100 -z-0"></div>

                    <h3 class="text-lg font-bold text-slate-900 mb-2">Cetak & Tempel</h3>
                    <p class="text-slate-500 text-sm px-4">Download file ZIP, kirim ke percetakan kemasan atau stiker, dan tempel pada produk.</p>
                </div>

                <div class="text-center relative">
                    <div class="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10 shadow-lg shadow-brand-500/30">3</div>
                    
                    <h3 class="text-lg font-bold text-slate-900 mb-2">Verifikasi & Monitor</h3>
                    <p class="text-slate-500 text-sm px-4">Konsumen scan untuk cek keaslian. Anda memantau data lokasi dan jumlah scan dari dashboard.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="py-24 bg-slate-50">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center text-slate-900 mb-12">Kata Mereka Tentang QRVerify</h2>
            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="flex text-yellow-400 mb-4">★★★★★</div>
                    <p class="text-slate-600 mb-6 leading-relaxed">"Sejak pakai QRVerify, laporan produk palsu turun drastis. Konsumen jadi lebih percaya beli online karena bisa cek keaslian sendiri."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Andi Pratama</div>
                            <div class="text-xs text-slate-500">Owner, Skincare Glow</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="flex text-yellow-400 mb-4">★★★★★</div>
                    <p class="text-slate-600 mb-6 leading-relaxed">"Fitur Batch Generator-nya sangat membantu tim produksi kami. Sangat cepat dan file ZIP-nya rapi, siap cetak."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Siti Rahma</div>
                            <div class="text-xs text-slate-500">Manager Ops, Herbal Nusantara</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="flex text-yellow-400 mb-4">★★★★★</div>
                    <p class="text-slate-600 mb-6 leading-relaxed">"Dashboard analitiknya keren. Saya bisa tau produk saya paling laku di kota mana berdasarkan data scan."</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div>
                            <div class="font-bold text-slate-900 text-sm">Budi Santoso</div>
                            <div class="text-xs text-slate-500">CEO, Kopi Senja</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="pricing" class="py-24 bg-white border-t border-slate-100">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Pilihan Paket Langganan</h2>
                <p class="text-slate-500 mt-2">Transparan. Tanpa biaya tersembunyi. Batalkan kapan saja.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                
                <div class="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition relative">
                    <h3 class="text-lg font-bold text-slate-900">Basic</h3>
                    <div class="my-4 flex items-baseline gap-1">
                        <span class="text-4xl font-extrabold text-slate-900">Rp 150rb</span>
                        <span class="text-slate-500">/bulan</span>
                    </div>
                    <p class="text-sm text-slate-500 mb-6">Cocok untuk UMKM yang baru mulai.</p>
                    <a href="/register?plan=basic" class="block w-full py-3 text-center border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:border-slate-900 hover:text-slate-900 transition">Pilih Basic</a>
                    
                    <div class="mt-8">
                        <p class="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">FITUR UTAMA</p>
                        <ul class="space-y-3 text-sm text-slate-600">
                            <li class="flex gap-2"><span class="text-green-500">✓</span> <strong>1.000</strong> Kuota QR Total</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> Max <strong>100</strong> QR per Batch</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> Halaman Verifikasi Standar</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> Email Support</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative transform md:-translate-y-4 border border-slate-800">
                    <div class="absolute top-0 right-0 bg-gradient-to-l from-brand-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wide">Paling Laris</div>
                    
                    <h3 class="text-lg font-bold text-brand-400">Pro Business</h3>
                    <div class="my-4 flex items-baseline gap-1">
                        <span class="text-4xl font-extrabold text-white">Rp 450rb</span>
                        <span class="text-slate-400">/bulan</span>
                    </div>
                    <p class="text-sm text-slate-400 mb-6">Untuk bisnis berkembang dengan volume tinggi.</p>
                    <a href="/register?plan=pro" class="block w-full py-3 text-center bg-brand-600 rounded-xl font-bold hover:bg-brand-500 transition shadow-lg shadow-brand-500/25">Pilih Pro</a>
                    
                    <div class="mt-8">
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">SEMUA FITUR BASIC, PLUS:</p>
                        <ul class="space-y-3 text-sm text-slate-300">
                            <li class="flex gap-2"><span class="text-brand-400">✓</span> <strong>10.000</strong> Kuota QR Total</li>
                            <li class="flex gap-2"><span class="text-brand-400">✓</span> Max <strong>1.000</strong> QR per Batch</li>
                            <li class="flex gap-2"><span class="text-brand-400">✓</span> <strong>Custom Logo</strong> Branding</li>
                            <li class="flex gap-2"><span class="text-brand-400">✓</span> Peta Lokasi Scan (Geo-Map)</li>
                            <li class="flex gap-2"><span class="text-brand-400">✓</span> Prioritas Support WhatsApp</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition">
                    <h3 class="text-lg font-bold text-slate-900">Enterprise</h3>
                    <div class="my-4 flex items-baseline gap-1">
                        <span class="text-4xl font-extrabold text-slate-900">Rp 1.2jt</span>
                        <span class="text-slate-500">/bulan</span>
                    </div>
                    <p class="text-sm text-slate-500 mb-6">Skala Pabrik / Manufaktur Besar.</p>
                    <a href="/register?plan=enterprise" class="block w-full py-3 text-center border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:border-slate-900 hover:text-slate-900 transition">Pilih Enterprise</a>
                    
                    <div class="mt-8">
                        <p class="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">POWERFUL FEATURES</p>
                        <ul class="space-y-3 text-sm text-slate-600">
                            <li class="flex gap-2"><span class="text-green-500">✓</span> <strong>100.000</strong> Kuota QR Total</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> Max <strong>10.000</strong> QR per Batch</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> <strong>API Integration</strong> (ERP/CRM)</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> Dedicated Account Manager</li>
                            <li class="flex gap-2"><span class="text-green-500">✓</span> SLA & Kontrak Resmi</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <section id="faq" class="py-24 bg-slate-50">
        <div class="container mx-auto px-6 max-w-4xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Pertanyaan Umum (FAQ)</h2>
            </div>
            
            <div class="space-y-4">
                {#each faqs as faq}
                    <details class="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <summary class="flex justify-between items-center font-bold text-slate-900 cursor-pointer p-6 list-none hover:bg-slate-50 transition">
                            <span>{faq.q}</span>
                            <span class="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p class="text-slate-600 px-6 pb-6 pt-0 leading-relaxed">
                            {faq.a}
                        </p>
                    </details>
                {/each}
            </div>
        </div>
    </section>

    <footer class="bg-slate-900 text-white pt-20 pb-10">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-4 gap-12 mb-16">
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center font-bold text-white">Q</div>
                        <span class="font-bold text-xl">QRVerify.</span>
                    </div>
                    <p class="text-slate-400 max-w-sm mb-6">
                        Standar baru perlindungan brand. Kami membantu bisnis menjaga keaslian produk dan meningkatkan kepercayaan pelanggan melalui teknologi.
                    </p>
                </div>
                
                <div>
                    <h4 class="font-bold mb-6">Produk</h4>
                    <ul class="space-y-4 text-slate-400 text-sm">
                        <li><a href="#features" class="hover:text-white transition">Fitur</a></li>
                        <li><a href="#pricing" class="hover:text-white transition">Harga</a></li>
                        <li><a href="/scan" class="hover:text-white transition">Web Scanner</a></li>
                        <li><a href="#" class="hover:text-white transition">API Docs</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold mb-6">Perusahaan</h4>
                    <ul class="space-y-4 text-slate-400 text-sm">
                        <li><a href="#" class="hover:text-white transition">Tentang Kami</a></li>
                        <li><a href="#" class="hover:text-white transition">Karir</a></li>
                        <li><a href="#" class="hover:text-white transition">Kebijakan Privasi</a></li>
                        <li><a href="#" class="hover:text-white transition">Syarat & Ketentuan</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>&copy; 2026 PT Teknologi Autentikasi Indonesia.</p>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-white">Instagram</a>
                    <a href="#" class="hover:text-white">LinkedIn</a>
                    <a href="#" class="hover:text-white">Twitter</a>
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    .perspective-1000 { perspective: 1000px; }
    /* Hide scrollbar for neat UI */
    details > summary { list-style: none; }
    details > summary::-webkit-details-marker { display: none; }
</style>
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
    import { goto } from '$app/navigation';

    let scannerStarted = $state(false);
    let scanner: Html5QrcodeScanner | null = null;

    onMount(() => {
        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
            rememberLastUsedCamera: true,
            aspectRatio: 1.0
        };

        const onScanSuccess = (decodedText: string, decodedResult: any) => {
            if(scanner) scanner.clear();
            
            const code = decodedText.split('/').pop();
            
            if (code) {
                goto(`/verify/${code}`);
            } else {
                alert('Format QR Code tidak valid');
                window.location.reload(); // Reload jika format salah agar bisa scan lagi
            }
        };

        const onScanFailure = (error: any) => {
            // console.warn(error);
        };

        scanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
        scanner.render(onScanSuccess, onScanFailure);
        scannerStarted = true;
    });

    // Bersihkan scanner saat komponen di-destroy (pindah halaman)
    onDestroy(() => {
        if(scanner) {
            try { scanner.clear(); } catch(e) { /* ignore */ }
        }
    });
</script>

<div class="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
    
    <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <a href="/" class="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </a>
        
        <span class="text-white font-black text-xl tracking-widest uppercase drop-shadow-md">SCANNER</span>
        <div class="w-12"></div> </div>

    <div class="w-full max-w-md px-4 relative z-10">
        <div class="bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-700 relative aspect-square flex flex-col justify-center">
            
            <div id="reader" class="w-full h-full bg-black"></div>

            <div class="absolute inset-0 pointer-events-none flex items-center justify-center p-10">
                <div class="w-64 h-64 relative">
                    
                </div>
            </div>

        </div>
    </div>

    <div class="mt-8 px-6 text-center z-20">
        <p class="text-white font-bold text-lg mb-2">
            Arahkan kamera ke QR Code
        </p>
        <p class="text-gray-300 text-sm">
            Pastikan ruangan cukup cahaya agar kode terbaca jelas.
        </p>
    </div>

</div>

<style>
    /* * GLOBAL OVERRIDES UNTUK HTML5-QRCODE 
     * Tujuannya membuat UI bawaan library menjadi High Contrast & Modern
     */

    /* Hilangkan border bawaan */
    :global(#reader) {
        border: none !important;
        background-color: black !important;
    }
    
    /* Video harus mengisi penuh container */
    :global(#reader video) {
        object-fit: cover;
        width: 100% !important;
        height: 100% !important;
        border-radius: 1.5rem; /* Sesuaikan dengan rounded-3xl */
    }

    /* Hilangkan status bar hijau bawaan yang sering muncul */
    :global(#reader__status_span) {
        display: none !important;
    }

    /* Styling tombol Request Permission (Tombol Izin Kamera) */
    :global(#reader__dashboard_section_csr button) {
        background-color: white !important;
        color: black !important;
        border: 2px solid white !important;
        padding: 12px 24px !important;
        border-radius: 9999px !important; /* Pill shape */
        font-weight: 800 !important;
        font-size: 1rem !important;
        margin-top: 20px !important;
        cursor: pointer !important;
        text-transform: uppercase;
        box-shadow: 0 4px 15px rgba(255,255,255, 0.3);
    }

    :global(#reader__dashboard_section_csr button:hover) {
        background-color: #e5e5e5 !important;
        transform: scale(1.05);
    }

    /* Menyembunyikan elemen select camera jika sudah aktif (opsional) */
    :global(#reader__dashboard_section_swaplink) {
        text-decoration: none !important;
        color: white !important;
        border: 1px solid white;
        padding: 4px 12px;
        border-radius: 4px;
        margin-top: 10px;
        display: inline-block;
    }
</style>
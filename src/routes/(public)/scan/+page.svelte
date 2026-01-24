<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
    import { goto } from '$app/navigation';

    let scannerStarted = $state(false);

    onMount(() => {
        // Konfigurasi Scanner
        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
            rememberLastUsedCamera: true
        };

        const onScanSuccess = (decodedText: string, decodedResult: any) => {
            // Hentikan scanner agar tidak scan berkali-kali
            scanner.clear();
            
            // Logic Extract Code
            // URL kita biasanya: http://domain.com/verify/KODE-UNIK
            // Kita ambil bagian akhirnya saja
            const code = decodedText.split('/').pop();
            
            if (code) {
                goto(`/verify/${code}`);
            } else {
                alert('Format QR Code tidak valid');
            }
        };

        const onScanFailure = (error: any) => {
            // Jangan lakukan apa-apa, ini terpanggil setiap frame jika tidak ada QR
        };

        const scanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
        scanner.render(onScanSuccess, onScanFailure);
        scannerStarted = true;
    });
</script>

<div class="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
    
    <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <a href="/" class="text-white bg-white/20 p-2 rounded-full backdrop-blur-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </a>
        <span class="text-white font-bold tracking-wide">SCANNER</span>
        <div class="w-10"></div> </div>

    <div class="w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
        <div id="reader" class="w-full"></div>
        
        </div>

    <p class="text-gray-400 mt-8 text-center text-sm px-8">
        Arahkan kamera ke QR Code yang terdapat pada kemasan produk.
    </p>

</div>

<style>
    /* Custom CSS untuk override style bawaan html5-qrcode agar lebih modern */
    :global(#reader) {
        border: none !important;
    }
    :global(#reader__scan_region) {
        background: black;
    }
    :global(#reader__dashboard_section_csr button) {
        background-color: white;
        color: black;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 10px;
    }
</style>
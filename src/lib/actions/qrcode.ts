// src/lib/actions/qrcode.ts
import QRCode from 'qrcode';

export function qrcode(node: HTMLCanvasElement, text: string) {
    // Fungsi untuk generate
    const generate = async () => {
        try {
            await QRCode.toCanvas(node, text, {
                width: 100, // Ukuran lebar
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    generate();

    return {
        update(newText: string) {
            text = newText;
            generate();
        }
    };
}
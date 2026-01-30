import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'; // <--- Pastikan import ini ada

export default defineConfig({
	plugins: [
        tailwindcss(), // <--- Pastikan dipanggil di sini
        sveltekit()
    ]
});
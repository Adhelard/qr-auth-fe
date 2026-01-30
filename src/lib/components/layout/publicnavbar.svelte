<script lang="ts">
    import { page } from '$app/stores';
    let isMenuOpen = $state(false);
</script>

<nav class="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
    <div class="glass-panel rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl transition-all hover:shadow-2xl hover:shadow-brand-500/10 bg-white/80 backdrop-blur-md border border-white/40">
        
        <a href="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-12 transition border border-slate-700">Q</div>
            <span class="font-bold text-lg tracking-tight text-slate-900">QR<span class="text-brand-600">Verify</span>.</span>
        </a>

        <div class="hidden md:flex items-center gap-8">
            <a href="/#features" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition">Fitur</a>
            <a href="/#process" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition">Cara Kerja</a>
            <a href="/#pricing" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition">Harga</a>
            <a href="/#faq" class="text-sm font-medium text-slate-600 hover:text-brand-600 transition">FAQ</a>
        </div>

        <div class="hidden md:flex items-center gap-3">
            <a href="/register" class="text-sm font-bold text-slate-700 hover:text-brand-600 px-4 py-2">Daftar</a>
            <a href="/scan" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-full shadow-lg shadow-brand-500/20 hover:shadow-xl transition transform hover:-translate-y-0.5">
                Scan
            </a>
        </div>

        <button class="md:hidden text-slate-600 p-2" onclick={() => isMenuOpen = !isMenuOpen}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
    </div>

    {#if isMenuOpen}
        <div class="absolute top-24 left-4 right-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 animate-[slideDown_0.2s_ease-out] md:hidden shadow-2xl border border-slate-100 bg-white">
            <a href="#features" onclick={() => isMenuOpen = false} class="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg">Fitur</a>
            <a href="#pricing" onclick={() => isMenuOpen = false} class="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg">Harga</a>
            <a href="#faq" onclick={() => isMenuOpen = false} class="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg">FAQ</a>
            <hr class="border-slate-100"/>
            <div class="flex flex-col gap-3">
                <a href="/login" class="w-full text-center font-bold text-slate-700 py-3 rounded-xl border border-slate-200">Masuk</a>
                <a href="/register" class="w-full text-center bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg">Daftar Akun</a>
            </div>
        </div>
    {/if}
</nav>
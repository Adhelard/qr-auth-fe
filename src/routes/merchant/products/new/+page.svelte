<script lang="ts">
    import { api } from '$lib/services/api';
    import { goto } from '$app/navigation';

    let form = $state({
        name: '',
        sku: '',
        description: '',
        image_url: '',
        active: true
    });
    let isSubmitting = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;
        try {
            await api('/products', {
                method: 'POST',
                body: JSON.stringify(form)
            });
            goto('/merchant/products');
        } catch (error: any) {
            alert(error.message);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Tambah Produk Baru</h1>
    
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onsubmit={handleSubmit} class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input bind:value={form.name} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="Contoh: Kopi Bubuk Premium" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">SKU (Kode Unik)</label>
                    <input bind:value={form.sku} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="KP-001" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                    <input bind:value={form.image_url} type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="https://..." />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea bind:value={form.description} rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"></textarea>
            </div>

            <div class="flex items-center gap-2">
                <input bind:checked={form.active} type="checkbox" id="active" class="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                <label for="active" class="text-sm text-gray-700">Produk Aktif (Dapat dibuatkan QR)</label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <a href="/merchant/products" class="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Batal</a>
                <button type="submit" disabled={isSubmitting} class="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
            </div>
        </form>
    </div>
</div>
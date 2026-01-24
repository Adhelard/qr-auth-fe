<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    
    // State untuk data produk
    let products = $state<any[]>([]);
    let isLoading = $state(true);

    onMount(async () => {
        try {
            const res = await api('/products');
            // Sesuaikan dengan respon Laravel (misal: res.data atau res langsung)
            products = res.data || res; 
        } catch (e) {
            alert('Gagal memuat produk');
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Daftar Produk</h1>
    <a href="/merchant/products/new" class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Tambah Produk
    </a>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    {#if isLoading}
        <div class="p-8 text-center text-gray-500">Memuat data...</div>
    {:else if products.length === 0}
        <div class="p-12 text-center">
            <p class="text-gray-500 mb-4">Belum ada produk.</p>
            <a href="/merchant/products/new" class="text-brand-600 font-medium hover:underline">Buat produk pertama</a>
        </div>
    {:else}
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                    <th class="px-6 py-4 font-semibold">Nama Produk</th>
                    <th class="px-6 py-4 font-semibold">SKU</th>
                    <th class="px-6 py-4 font-semibold">Status</th>
                    <th class="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                {#each products as product}
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                {#if product.image_url}
                                    <img src={product.image_url} alt={product.name} class="w-10 h-10 rounded-lg object-cover border border-gray-200">
                                {:else}
                                    <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                                {/if}
                                <span class="font-medium text-gray-900">{product.name}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                        <td class="px-6 py-4">
                            <span class={`px-2.5 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {product.active ? 'Aktif' : 'Non-aktif'}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <a href={`/merchant/products/${product.id}`} class="text-brand-600 hover:text-brand-800 text-sm font-medium">Edit</a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>
<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';

    let batches = $state<any[]>([]);
    let isLoading = $state(true);

    onMount(async () => {
        try {
            const res = await api('/qr-batches');
            batches = res.data || res;
        } catch (e) {
            console.error(e);
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Batch Produksi QR</h1>
    <a href="/merchant/qr-batches/new" class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        Buat Batch Baru
    </a>
</div>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each batches as batch}
        <a href={`/merchant/qr-batches/${batch.id}`} class="block bg-white p-5 rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition group">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-bold text-gray-900 group-hover:text-brand-600 transition">{batch.batch_name}</h3>
                    <p class="text-sm text-gray-500">{batch.product?.name || 'Unknown Product'}</p>
                </div>
                <span class="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                    Qty: {batch.quantity}
                </span>
            </div>
            
            <div class="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center text-sm">
                <span class="text-gray-400 text-xs">Dibuat: {new Date(batch.created_at).toLocaleDateString()}</span>
                {#if batch.qr_codes_count > 0}
                    <span class="text-green-600 flex items-center gap-1 font-medium">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Generated
                    </span>
                {:else}
                     <span class="text-amber-600 flex items-center gap-1 font-medium">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Draft
                    </span>
                {/if}
            </div>
        </a>
    {/each}
</div>
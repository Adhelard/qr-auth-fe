<script lang="ts">
	import PublicNavbar from '$lib/components/Layout/PublicNavbar.svelte';
	// Footer bisa dibuat nanti di $lib/components/Layout/PublicFooter.svelte
	import '../../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 font-sans selection:bg-brand-100 selection:text-brand-900">
	<PublicNavbar />
	
	<main>
		{@render children()}
	</main>

	<footer class="bg-white border-t border-gray-200 py-8 mt-20">
		<div class="container-center text-center text-gray-500 text-sm">
			&copy; {new Date().getFullYear()} QR Product Verification System. All rights reserved.
		</div>
	</footer>
</div>
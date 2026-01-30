<script lang="ts">
	import '../../app.css'; // Import CSS Global (Tailwind)
	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900">
	{@render children()}
</div>
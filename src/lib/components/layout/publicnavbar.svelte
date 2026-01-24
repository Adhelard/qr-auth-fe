<script lang="ts">
	// State simpel untuk mobile menu jika diperlukan nanti
	let isMenuOpen = $state(false);
</script>

<nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
	<div class="container-center">
		<div class="flex justify-between h-16 items-center">
			<div class="flex-shrink-0 flex items-center gap-2">
				<div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
				<span class="font-bold text-xl tracking-tight text-gray-900">QRVerify</span>
			</div>

			<div class="hidden md:flex space-x-8 items-center">
				<a href="#features" class="text-gray-600 hover:text-brand-600 font-medium transition">Fitur</a>
				<a href="#how-it-works" class="text-gray-600 hover:text-brand-600 font-medium transition">Cara Kerja</a>
				<div class="flex gap-3 ml-4">
					<a href="/login" class="px-4 py-2 text-brand-600 font-semibold hover:bg-brand-50 rounded-lg transition">
						Masuk
					</a>
					<a href="/scan" class="px-4 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 shadow-md transition">
						Coba Scan
					</a>
				</div>
			</div>
		</div>
	</div>
</nav>
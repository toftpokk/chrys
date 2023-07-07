<script>
	import { page } from '$app/stores';
</script>

<main class="w-full my-6">
	<div class="max-w-4xl block mx-auto my-8 text-xl">
		<h1 class="text-2xl font-bold mb-4">{$page.status}</h1>
		<p class="text-2xl mb-4">{$page.error?.message}</p>
	</div>
</main>

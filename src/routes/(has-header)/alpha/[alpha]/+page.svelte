<script lang="ts">
	import { page } from '$app/stores';
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    const alpha = $page.params.alpha
    
	export let data : import("./$types").PageData
</script>
<svelte:head>
    <title>{alpha} - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Alphabet: {alpha}</h1>
    <CardList data={data} hasNav={true}/>
</main>
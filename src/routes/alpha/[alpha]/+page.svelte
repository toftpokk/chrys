<script lang="ts">
	import { page } from '$app/stores';
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    const alpha = $page.params.alpha
    
	export let data : {work: work[]};
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Alphabet: {alpha}</h1>
    <CardList data={data} hasNav={false}/>
</main>
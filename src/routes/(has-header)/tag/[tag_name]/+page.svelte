<script lang="ts">
	import { page } from '$app/stores';
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    const tag_name = $page.params.tag_name
    
	export let data;
</script>

<svelte:head>
    <title>{tag_name} - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Tag: {tag_name}</h1>
    <CardList data={data} hasFilters={true}/>
</main>
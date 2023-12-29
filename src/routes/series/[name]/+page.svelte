<script lang="ts">
	import { page } from '$app/stores';
    import Header from '$lib/Header.svelte'
	import CardList from '$lib/CardList.svelte';
    const series = $page.params.name
    
	export let data : import("./$types").PageData
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Series: {series}</h1>
    <CardList data={data}/>
</main>
<script lang="ts">
	import { page } from '$app/stores';
	import CardList from '$lib/CardList.svelte';
    const series = $page.params.name
    
	export let data : import("./$types").PageData
    data.work = data.work.sort((a,b)=>{
        return a.name > b.name? 1:-1
    })
</script>

<svelte:head>
    <title>{series} - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Series: {series}</h1>
    <CardList data={data}/>
</main>
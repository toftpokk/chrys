<script lang="ts">
    import Header from '$lib/Header.svelte'
	import CardList from '$lib/CardList.svelte';
    
	export let data : import("./$types").PageData
</script>
<svelte:head>
    <title>Chrys</title>
</svelte:head>
<main class="w-full" >
    <Header/>
    <CardList data={data} hasFilters={true} groupSeries={true}/>
</main>
<script lang="ts">
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    
	export let data : {work: work[], num_pages: number};
</script>
<main class="w-full" >
    <Header/>
    <CardList data={data} frameLoad={true} filterView={true}/>
</main>
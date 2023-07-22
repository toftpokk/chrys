<script lang="ts">
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    
	export let data : {work: work[]};
</script>
<main class="w-full" >
    <Header/>
    <CardList data={data} frameLoad={true}/>
</main>
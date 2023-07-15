<script lang="ts">
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    
	export let data : {work: work[]};
</script>
<main class="w-full mt-6" >
    <CardList data={data}/>
    <Footer/>
</main>
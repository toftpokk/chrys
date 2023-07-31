<script lang="ts">
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
    
	export let data : {work: work[], alpha: string[]};
</script>
<main class="w-full" >
    <Header/>
    <ol class="flex justify-start flex-wrap max-w-7xl mx-auto">
        {#each data.alpha as char}
        <li class="inline my-[0.5ch]"><a class="bg-mid px-[1ch] mx-[0.5ch] py-[0.3ch]" href={"/alpha/"+encodeURIComponent(char)}>{char}</a></li>
        {/each}
    </ol>
    <CardList data={data} frameLoad={true}/>
</main>
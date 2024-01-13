<script lang="ts">
    import Header from '$lib/Header.svelte'
	import Tag from '$lib/atom/Tag.svelte';
	import { IsEmptySeries } from '$lib/helper';
    export let data : import("./$types").PageData
    let series = data.series.filter((s)=>{
        return !IsEmptySeries(s)
    })
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Series</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each series as s}
                <a href={"/series/"+s} class="pill m-1">{s}</a>
            {/each}
        </div>
    </div>
</main>
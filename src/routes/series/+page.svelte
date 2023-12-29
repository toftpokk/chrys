<script lang="ts">
	import { goto } from '$app/navigation';
    import Header from '$lib/Header.svelte'
	import Button from '$lib/atom/Button.svelte';
	import Tag from '$lib/atom/Tag.svelte';
    export let data : {series: string[]}
    let series = data.series.filter((s)=>{
        return ![null, ""].includes(s)
    })
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Series</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each series as s}
                <Tag href={"/series/"+s} size="lg">{s}</Tag>
            {/each}
        </div>
    </div>
</main>
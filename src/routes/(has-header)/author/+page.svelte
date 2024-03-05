<script lang="ts">
	import type { author } from '$lib/types';
    export let data : import("./$types").PageData
    let authors = data.authors.sort((a,b)=>a.name.localeCompare(b.name));
    const favorite_authors = data.authors.filter((a)=>a.favorite == 1).sort()
    let sort = "Count";

    const toggleSort = ()=>{
        if(sort === "Alphabet"){
            sort = "Count"
            authors = data.authors.sort((a,b)=>a.name.localeCompare(b.name));
        }
        else{
            sort = "Alphabet"
            authors = data.authors.sort((a,b)=>a.work_count <= b.work_count?1:-1);
        }
    }
</script>

<svelte:head>
    <title>Authors - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Authors</h1>
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center mb-4">
            {#each favorite_authors as author}
                <a href={"/author/"+author.author_id} class="pill m-1">{author.name} <span class="text-gray-30">{author.work_count}</span></a>
            {/each}
        </div>
        <div class="flex flex-wrap justify-center mb-4">
            <button class="pill text-2xl px-3 py-2" on:click={toggleSort}>Sort: {sort}</button>
        </div>
        <div class="flex flex-wrap justify-center mb-4">
            {#each authors as author}
                <a href={"/author/"+author.author_id} class="pill m-1">{author.name} <span class="text-gray-30">{author.work_count}</span></a>
            {/each}
        </div>
    </div>
</main>
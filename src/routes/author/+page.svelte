<script lang="ts">
    import Header from '$lib/Header.svelte'
	import Button from '$lib/atom/Button.svelte';
	import type { author } from '$lib/types';
	import { onMount } from 'svelte';
    export let data : { authors: (author & {work_count:number})[]};
    let authors = data.authors;
    const favorite_authors = data.authors.filter((a)=>a.favorite == true)
    let sort = "Count";
    onMount(()=>{
        authors = data.authors.sort((a,b)=>a.name.localeCompare(b.name));
    })

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
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Authors</h1>
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center mb-4">
            {#each favorite_authors as author}
                <a href={"/author/"+author.author_id} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{author.name} <span class=" bg-gray-700 p-0.5">{author.work_count}</span></a>
            {/each}
        </div>
        <div class="flex flex-wrap justify-center mb-4">
            <Button onclick={toggleSort}>Sort: {sort}</Button>
        </div>
        <div class="flex flex-wrap justify-center mb-4">
            {#each authors as author}
                <a href={"/author/"+author.author_id} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{author.name} <span class=" bg-gray-700 p-0.5">{author.work_count}</span></a>
            {/each}
        </div>
    </div>
</main>
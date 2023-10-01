<script lang="ts">
    import Header from '$lib/Header.svelte'
	import type { author } from '$lib/types';
    export let data : {authors: author[]}
    const favorite_authors = data.authors.filter((a)=>a.favorite == true)
    const other_authors = data.authors.filter((a)=>a.favorite != true)
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Authors</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each favorite_authors as author}
                <a href={"/author/"+author.author_id} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{author.name}</a>
            {/each}
        </div>
        <hr class="my-3 border-white">
        <div class="block mb-4">
            {#each other_authors as author}
                <a href={"/author/"+author.author_id} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{author.name}</a>
            {/each}
        </div>
    </div>
</main>
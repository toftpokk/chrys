<script lang="ts">
    import Header from '$lib/Header.svelte'
    export let data : {tags: string[]}
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Tags</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each data.tags as tag}
                <a href={"/tag/"+tag} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{tag}</a>
            {/each}
        </div>
    </div>
</main>
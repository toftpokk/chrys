<script lang="ts">
    import Header from '$lib/Header.svelte'
	import Tag from '$lib/atom/Tag.svelte';
    export let data : {tags: string[]}
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Tags</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each data.tags as tag}
                <Tag href={"/tag/"+tag} size="lg">{tag}</Tag>
            {/each}
        </div>
    </div>
</main>
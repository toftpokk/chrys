<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from "$env/static/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import type { work } from "./types";
    import { navigating, page } from '$app/stores';

    export let frameLoad = false; // show empty frames when load
    export let data: {work: work[]}
    export let hasNav = true;

    let work : work[]= []
    $: {
        work = data.work
    }
</script>
<div class="max-w-7xl mx-auto">
    {#if hasNav}
        <PageNav max={-1}/>
        <Sorting />
    {/if}
    
    <ul class="flex flex-wrap justify-center">
        {#if $navigating && frameLoad}
            {#each Array(30) as w}
                <Card
                        image={""}
                        url={""}
                        author={"loading..."}
                        title={"loading..."}
                        viewed={false}
                        favorite={false}
                        author_id={-1}
                    />
            {/each}
        {:else}
            {#each work as w}
                <Card
                    image={`${PUBLIC_IMAGE_SERVER}/images/${PUBLIC_IMAGE_REPO}/${encodeURIComponent(w.author_name)}/${encodeURIComponent(w.name)}/${w.images[0]}`}
                    url={`/work/${w.work_id}`}
                    author={w.author_name}
                    title={w.name}
                    viewed={w.viewed}
                    favorite={w.favorite}
                    author_id={w.author_id}
                />
            {/each}
        {/if}
    </ul>
    {#if hasNav}
        <PageNav max={-1}/>
    {/if}   
</div>
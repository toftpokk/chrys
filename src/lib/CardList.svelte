<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from "$env/static/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import type { work } from "./types";

    export let data: {work: work[], num_pages?: number}
    export let hasNav = true;
    export let filterView = false;

    let page_max = -1;
    let work : work[]= []
    $: {
        work = data.work
        if(data.num_pages) page_max = data.num_pages
    }
</script>
<div class="max-w-7xl mx-auto">
    {#if hasNav}
        <PageNav max={page_max}/>
        <Sorting filterView={filterView}/>
    {/if}
    
    <ul class="flex flex-wrap justify-center">
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
    </ul>
    {#if hasNav}
        <PageNav max={page_max}/>
    {/if}   
</div>
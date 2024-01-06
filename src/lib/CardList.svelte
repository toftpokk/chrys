<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from "$env/static/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import { IsEmptySeries } from "./helper";
	import type { work } from "./types";

    export let data: {work: work[], num_pages?: number}
    export let hasNav = true;
    export let filterView = false;
    export let groupSeries = false; // set to default false

    let page_max = -1;
    let series : string[] = []
    let work= data.work
    if (groupSeries){
        work = work.filter(filterDuplicateSeries)
    }
    if(data.num_pages) page_max = data.num_pages

    function filterDuplicateSeries(w : work){
        if(IsEmptySeries(w.series)){
            return true
        }
        if(series.includes(w.series)){
            return false
        }
        series.push(w.series)
        return true
    }
</script>
<div class="max-w-7xl mx-auto" data-sveltekit-reload> <!-- Or else page wont load-->
    {#if hasNav}
        <PageNav max={page_max}/>
        <Sorting filterView={filterView}/>
    {/if}
    
    <ul class="flex flex-wrap justify-center">
        {#each work as w}
            <Card
                image={
                    w.images[0]
                    ?`${PUBLIC_IMAGE_SERVER}/images/${PUBLIC_IMAGE_REPO}/${encodeURIComponent(w.author_name)}/${encodeURIComponent(w.name)}/${w.images[0]}`
                    : '/image-not-found.jpg'
                }
                url={`/work/${w.work_id}`}
                author={w.author_name}
                title={w.name}
                viewed={w.viewed}
                favorite={w.favorite}
                author_id={w.author_id}
                isSeries={groupSeries? !IsEmptySeries(w.series): false}
                series={w.series}
            />
        {/each}
    </ul>
    {#if hasNav}
        <PageNav max={page_max}/>
    {/if}   
</div>
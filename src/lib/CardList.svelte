<script lang="ts">
	import { env } from "$env/dynamic/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import { IsEmptySeries } from "./helper";
	import type { work } from "./types";

    export let data: {work: work[], num_pages?: number}
    export let hasNav = true;
    export let hasFilters = false;
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
        <Sorting hasFilters={hasFilters}/>
    {/if}
    
    <ul class="flex flex-wrap justify-center">
        {#each work as w}
            <Card
                image={
                    w.images[0]
                    ?`${env.PUBLIC_IMAGE_SERVER}/images/${env.PUBLIC_IMAGE_REPO}/${encodeURI(w.path)}/${w.images[0]}`
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
                tags={w.tags}
            />
        {/each}
    </ul>
    {#if hasNav}
        <PageNav max={page_max}/>
    {/if}   
</div>
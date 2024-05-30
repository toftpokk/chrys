<script lang="ts">
	import { navigating } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import { IsEmptySeries, encodePathURI } from "./helper";
	import type { work } from "./types";

    export let data: {work: Omit<work,"images">[], num_pages: number}
    export let hasNav = true;
    export let hasFilters = false;
    export let groupSeries = false; // set to default false

    let page_max = -1;
    let work : Omit<work,"images">[] = []
    $: work = groupSeries ? filterDuplicateSeries(data.work) : data.work
    $: page_max = data.num_pages

    function filterDuplicateSeries(works : Omit<work,"images">[]){
        let series : string[]= []
        return works.filter((w)=>{
            if(IsEmptySeries(w.series)){
                return true
            }
            if(series.includes(w.series)){
                return false
            }
            series.push(w.series)
            return true
        })
    }
</script>
<div class="max-w-7xl mx-auto">
    {#if hasNav}
        <PageNav max={page_max}/>
        <Sorting hasFilters={hasFilters}/>
    {/if}
    
    <ul class="flex flex-wrap justify-center">
        {#each work as w}
            <Card
                image={
                    w.cover
                    ?`${env.PUBLIC_IMAGE_SERVER}/images/${env.PUBLIC_IMAGE_REPO}/${encodePathURI(w.path)}/${w.cover}`
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
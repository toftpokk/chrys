<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from "$env/static/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import { get_page } from "./helper";
	import type { work } from "./types";
    import { page } from '$app/stores';
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";

    export let data: {work: work[]}

    let page_num = get_page($page.url.searchParams)
    let work : work[]= []
    $: {
        work = data.work
        $page.url.searchParams.set("page",String(page_num))
        if(browser){
            goto("?"+$page.url.searchParams.toString())
        }
    }
</script>
<div class="max-w-7xl mx-auto">
    <PageNav bind:page_num={page_num} max={-1}/>
    <Sorting />
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
    <PageNav bind:page_num={page_num} max={-1}/>
</div>
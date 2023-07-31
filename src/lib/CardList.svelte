<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from "$env/static/public";
	import Card from "./Card.svelte";
    import PageNav from "./PageNav.svelte";
	import Sorting from "./Sorting.svelte";
	import { get_page } from "./helper";
	import type { work } from "./types";
    import { navigating, page } from '$app/stores';
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";

    export let frameLoad = false; // show empty frames when load
    export let data: {work: work[]}
    export let hasNav = true;

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
    {#if hasNav}
        <PageNav bind:page_num={page_num} max={-1}/>
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
        <PageNav bind:page_num={page_num} max={-1}/>
    {/if}   
</div>
<script lang="ts">
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
	import Sorting from '$lib/Sorting.svelte';
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
	import { page } from '$app/stores';
	import { get_page } from '$lib/helper';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
    
    let page_num = get_page($page.url.searchParams);
	export let data : {work: work[]};
    let work : work[]= [];
    $: {
        work = data.work
        $page.url.searchParams.set("page",String(page_num))
        if(browser){
            goto("?"+$page.url.searchParams.toString())
        }
    }
</script>
<main class="w-full mt-6" >
    <PageNav bind:page_num={page_num} max={-1}/>
    <Sorting />
    <ul role="list" class="max-w-7xl flex flex-wrap justify-center mx-auto">
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
    <Footer/>
</main>
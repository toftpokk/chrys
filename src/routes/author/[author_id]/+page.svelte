<script lang="ts">
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
    
	export let data : {work: work[], page: number, author_name: string};
    let page_num = data.page
    let works : work[] = []
    $: {
        works = data.work;
        $page.url.searchParams.set("page",String(page_num))
        if(browser){
            goto("?"+$page.url.searchParams.toString())
        }
    }
    const author_name = data.author_name
</script>
<main class="w-full mt-6" >
    <PageNav bind:page_num={page_num} max={-1}/>
    <h1 class="text-4xl flex justify-center my-8">Author: {author_name}</h1>
    <ul role="list" class="max-w-7xl flex flex-wrap justify-center mx-auto">
        {#each works as w}
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
<script lang="ts">
	import { page } from '$app/stores';
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
    const tag_name = $page.params.tag_name
    
	export let data : {work: work[], page:number};
    const works = data.work;
    const page_num = data.page
</script>
<main class="w-full mt-6" >
    <h1 class="text-4xl flex justify-center my-8">Tag: {tag_name}</h1>
    <PageNav page_num={page_num} max={-1}/>
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
    <PageNav page_num={page_num} max={-1}/>
    <Footer/>
</main>
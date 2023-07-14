<script lang="ts">
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
	import Sorting from '$lib/Sorting.svelte';
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
    
	export let data : {work: work[]};
    let work : work[]= [];
    $: {
        work = data.work
    }
</script>
<main class="w-full mt-6" >
    <PageNav max={-1}/>
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
    <PageNav max={-1}/>
    <Footer/>
</main>
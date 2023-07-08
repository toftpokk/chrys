<script lang="ts">
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import { image_server } from '$lib/consts';
    
	export let data : {work: work[], page: number, author_name: string};
    const works = data.work;
    const page = data.page
    const author_name = data.author_name
    console.log(works)
</script>
<main class="w-full mt-6" >
    <PageNav page={page} max={-1}/>
    <h1 class="text-4xl flex justify-center my-8">{author_name}</h1>
    <ul role="list" class="max-w-7xl flex flex-wrap justify-center mx-auto">
        {#each works as w}
            <Card
                image={`${image_server}/images/works/${encodeURIComponent(w.author_name)}/${encodeURIComponent(w.name)}/${w.images[0]}`}
                url={`/work/${w.work_id}`}
                author={w.author_name}
                title={w.name}
                viewed={w.viewed}
                favorite={w.favorite}
                author_id={w.author_id}
            />
        {/each}
    </ul>
    <PageNav page={page} max={-1}/>
    <Footer/>
</main>
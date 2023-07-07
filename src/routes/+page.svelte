<script lang="ts">
    import Card from '../Card.svelte'
    import PageNav from '../PageNav.svelte';
    import Footer from '../Footer.svelte'
    import type { work } from '../lib/types'
	export let data : {work: work[]};
    const works : work[] = []
    const page = 1
</script>
<main class="w-full mt-6" >
    <!-- <PageNav page={page} max={-1} url="/"/> -->
    <ul role="list" class="max-w-7xl flex flex-wrap justify-center mx-auto">
        {#each works as w}
            <Card
                image={w.images[0]}
                url={'/work/'+w.work_id}
                author={w.author_name}
                title={w.name}
                viewed={w.viewed}
                favorite={w.favorite}
                author_id={w.author_id}
            />
        {/each}
    </ul>
    <!-- <PageNav page={page} max={-1} url="/"/> -->
    <Footer/>
</main>
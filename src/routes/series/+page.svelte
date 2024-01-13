<script lang="ts">
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
    import Card from '$lib/Card.svelte';
import Header from '$lib/Header.svelte'
	import Tag from '$lib/atom/Tag.svelte';
	import { IsEmptySeries } from '$lib/helper';
    export let data : import("./$types").PageData
    let series = data.series.sort()
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Series</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <div class="mb-4 flex flex-wrap">
            {#each series as s}
                <Card
                    image={`${PUBLIC_IMAGE_SERVER}/images/${PUBLIC_IMAGE_REPO}/${encodeURIComponent(s.author_name)}/${encodeURIComponent(s.name)}/${s.image}`}
                    url={"/series/"+s.series_name}
                    title={s.series_name}
                    author={""}
                    series={s.series_name}
                    isSeries={true}
                    viewed={false}
                    favorite={false}
                    author_id={0}
                />
                <!-- <a href={"/series/"+s.name} class="pill m-1">{s.name}</a> -->
            {/each}
        </div>
    </div>
</main>
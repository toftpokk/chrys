<script lang="ts">
	import { env } from '$env/dynamic/public';
    import Card from '$lib/Card.svelte';
	import Tag from '$lib/atom/Tag.svelte';
	import { IsEmptySeries } from '$lib/helper';
    export let data : import("./$types").PageData
    let series = data.series.sort()
</script>

<svelte:head>
    <title>Series - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Series</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <ul class="mb-4 flex flex-wrap">
            {#each series as s}
             <!-- TODO encodeURI does not do '?' -->
                <Card
                    image={`${env.PUBLIC_IMAGE_SERVER}/images/${env.PUBLIC_IMAGE_REPO}/${encodeURI(s.path)}/${s.image}`}
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
        </ul>
    </div>
</main>
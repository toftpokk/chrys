<script lang="ts">
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
	import { page } from '$app/stores';
	import AuthorReactions from '$lib/AuthorReactions.svelte';
	import type { PageData } from './$types';
    
	export let data : PageData;
    const author_id = $page.params.author_id
    const author_name = data.author_name

    const toggleFav = async()=>{
        const res = await fetch(`/api/author/${author_id}/favorite`,{
            method: 'POST',
            body: JSON.stringify({state: !data.favorite}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const results = await res.json()
        data.favorite = results.state
    }
</script>

<svelte:head>
    <title>{author_name} - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Author: {author_name}</h1>
    <div class="flex justify-center">
        <AuthorReactions favorite={data.favorite} on:toggleFav={toggleFav}/>
    </div>
    <CardList data={data} groupSeries={true} hasNav={true} hasSort={false}/>
</main>
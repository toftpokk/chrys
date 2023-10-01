<script lang="ts">
    import Header from '$lib/Header.svelte'
    import type { work } from '$lib/types'
	import CardList from '$lib/CardList.svelte';
	import { page } from '$app/stores';
	import AuthorReactions from '$lib/AuthorReactions.svelte';
    
	export let data : {work: work[], author_name: string, favorite: boolean};
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
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Author: {author_name}</h1>
    <div class="flex justify-center">
        <AuthorReactions favorite={data.favorite} on:toggleFav={toggleFav}/>
    </div>
    <CardList data={data}/>
</main>
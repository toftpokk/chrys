<script lang="ts">
	import type { work } from '$lib/types';
    export let data : { work : work}
    const work = data.work
    const tag_string = work.tags.join(' ')

    import Header from '$lib/Header.svelte'
	import { PUBLIC_TAG_SUGGESTIONS } from '$env/static/public';

    function handleSubmit(this: HTMLFormElement){
        const data = new FormData(this);
        const tag_string = String(data.get("tags"))
        const tags = tag_string ? tag_string.split(' ').filter(t=>t!='') : [];
        fetch(`/api/${work.work_id}/tag`,{
            method: 'POST',
            body: JSON.stringify(tags),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
    }
    const tag_suggestions = PUBLIC_TAG_SUGGESTIONS.split(" ")
</script>
<main class="w-full my-6" >
    <Header/>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">{work.name}</h1>
        <h2 class="mb-3 font-semibold">by {work.author_name}</h2>
        <form method="POST" on:submit|preventDefault={handleSubmit}>
            <textarea class="h-32 bg-light" name="tags" value={tag_string}/>
            <br/>
            <input class="bg-light font-bold my-3 px-2 py-2 rounded-sm cursor-pointer" type="submit" value="Submit"/>
        </form>
        <h2 class="text-2xl mt-3 ms-2">Suggestions:</h2>
        <ul class="my-3 block">
            {#each tag_suggestions as tag}
                <li class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{tag}</li>
            {/each}
        </ul>
        <a class="text-xl font-bold bg-light px-2 py-1 " href={`/work/${work.work_id}`}>&larr; Return</a>
    </div>
</main>
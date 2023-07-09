<script lang="ts">
	import type { work } from '$lib/types';
    export let data : { work : work}
    const work = data.work
    const tag_string = work.tags.join(' ')

    import Footer from '$lib/Footer.svelte'
</script>
<main class="w-full my-6" >
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">{work.name}</h1>
        <h2 class="mb-3 font-semibold">by {work.author_name}</h2>
        <form method="POST" action="?/update_tag">
            <textarea class="h-32 bg-light" name="tags" value={tag_string}/>
            <br/>
            <input class="bg-light font-bold my-3 px-2 py-2 rounded-sm cursor-pointer" type="submit" value="Submit"/>
        </form>
        <a class="text-xl font-bold bg-light px-2 py-1 " href={`/work/${work.work_id}`}>&larr; Return</a>
    </div>
    <Footer/>
</main>
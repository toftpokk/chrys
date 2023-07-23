<script lang="ts">
	import type { work } from '$lib/types';
    import Header from '$lib/Header.svelte'
	import { PUBLIC_TAG_SUGGESTIONS } from '$env/static/public';
	import { onMount } from 'svelte';
    export let data : { work : work}
    const work = data.work
    const tag_subsets = PUBLIC_TAG_SUGGESTIONS.split("\n")
    const tags = tag_subsets.map((tag_subset)=>(tag_subset.split(" ")))
    let taglist : string[] = work.tags.slice(0)
    let taglist_element : HTMLElement;
    let tag_included : Record<string,boolean> = {}

    function handleSubmit(this: HTMLFormElement){
        fetch(`/api/${work.work_id}/tag`,{
            method: 'POST',
            body: JSON.stringify(taglist),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
    }
    function rerender_el(){
        // Refresh taglist element
        taglist_element.innerHTML = ""
        for(let t in taglist){
            const child = document.createElement("button")
            if(work.tags.includes(taglist[t])){
                child.classList.add("bg-light")
            }
            else{
                child.classList.add("bg-warn")
            }
            child.classList.add("mx-1")
            child.classList.add("text-xl")
            child.classList.add("rounded-lg")
            child.classList.add("px-2")
            child.classList.add("py-1")
            child.classList.add("select-none")
            child.onclick = ()=>tag_click(taglist[t])
            child.innerHTML = taglist[t]
            taglist_element.appendChild(child)
        }
        // refresh suggestions
        tag_included = {}
        taglist.forEach(tag => {
            tag_included[tag] = true
        });
    }
    function tag_click(tag: string){
        if(taglist.includes(tag)){
            taglist = taglist.filter(t=>t!=tag)
        } 
        else{
            taglist.push(tag)
        }
        rerender_el()
    }
    onMount(()=>{
        rerender_el()
    })
</script>
<main class="w-full my-6" >
    <Header/>
    <template>
        <div class="mb-2 text-xl bg-warn px-2 py-1 rounded-lg mx-1"></div>
        <div class="mb-2 text-xl bg-light px-2 py-1 rounded-lg mx-1"></div>
    </template>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <a class="text-xl font-bold bg-light px-2 py-2 my-3 inline-block" href={`/work/${work.work_id}`}>&larr; Return</a>
        <h1 class="text-2xl font-bold mb-4">{work.name}</h1>
        <h2 class="mb-3 font-semibold">by {work.author_name}</h2>
        <div bind:this={taglist_element} class="bg-mid rounded-md h-32 leading-10 overflow-scroll"></div>
        <button class="bg-light font-bold my-3 px-2 py-2 rounded-sm" on:click={handleSubmit}>Submit &rarr;</button>
        <h2 class="text-2xl mt-3 ms-2">Suggestions:</h2>
        <ul class="my-3 block">
            {#each tags as tag_subset}
                {#each tag_subset as tag}
                    <li class="inline-block">
                        <button 
                        on:click={()=>{tag_click(tag)}} 
                        class="mb-2 text-xl bg-light px-2 py-1 rounded-lg mx-1" 
                        class:bg-warn={tag_included[tag]}>{tag}</button>
                    </li>
                {/each}
                <hr class="my-3"/>
            {/each}
        </ul>
    </div>
</main>
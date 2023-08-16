<script lang="ts">
    import Header from '$lib/Header.svelte'
	import { get_tag_suggestions } from '$lib/helper';
	import type { work } from '$lib/types';
	import { onMount } from 'svelte';
    export let data : { work : work}
    const work = data.work

    const tag_suggestions = get_tag_suggestions()

    let included_tags = [...work.tags]
    let current_tags = [...work.tags]
    let current_tags_element : HTMLElement;

    let custom_tag = ""
    
    // let tag_included : Record<string,boolean> = {}

    async function submit_tags(this: HTMLFormElement){
        const res = await fetch(`/api/${work.work_id}/tag`,{
            method: 'POST',
            body: JSON.stringify(current_tags),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        if(!res.ok){
            return // TODO error handling
        }
        included_tags = [...current_tags]
        render_tags()
    }

    const render_tags = ()=>{
        current_tags_element.innerHTML = ""
        for(let index in current_tags){
            const tag_name = current_tags[index]
            // Create tag element
            let template : HTMLTemplateElement
            if(included_tags.includes(tag_name)){
                template = document.getElementById("template-tag") as HTMLTemplateElement;
            }
            else{
                template = document.getElementById("template-tag-include") as HTMLTemplateElement;
            }
            const tag_element = template.content.children[0].cloneNode() as HTMLButtonElement;
            
            // Data
            tag_element.onclick = ()=>toggle_tag_inclusion(tag_name)
            tag_element.innerHTML = tag_name
            current_tags_element.appendChild(tag_element)
        }
    }
    
    const toggle_tag_inclusion = (tag_name:string) =>{
        if(current_tags.includes(tag_name)){
            current_tags = current_tags.filter(name=>name!=tag_name)
        }
        else{
            current_tags = [...current_tags, tag_name]
        }
        render_tags()
    }
    onMount(()=>{
        render_tags()
    })
</script>
<main class="w-full my-6" >
    <Header/>
    <template id="template-tag-include">
        <button class="mx-1 text-xl rounded-lg px-2 py-1 select-none bg-warn"></button>
    </template>
    <template id="template-tag">
        <button class="mx-1 text-xl rounded-lg px-2 py-1 select-none bg-light"></button>
    </template>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <button class="text-xl font-bold bg-light px-2 py-2 my-3 inline-block"
           on:click={()=>history.back()}>&larr; Return</button>
        <h1 class="text-2xl font-bold mb-4">{work.name}</h1>
        <h2 class="mb-3 font-semibold">by {work.author_name}</h2>

        <!-- Current Tags-->
        <div class="bg-mid rounded-md h-32 leading-10 overflow-scroll"
             bind:this={current_tags_element} ></div>
        <button class="bg-light font-bold my-3 px-2 py-2 rounded-sm" 
                on:click={submit_tags}>Submit &rarr;</button>
        
        <!-- Custom Tags -->
        <h2 class="text-2xl mt-3 ms-2 mb-3">Add Tag:</h2>
        <input bind:value={custom_tag} class="bg-light rounded-md leading-10"/>
        <button class="bg-light font-bold my-3 px-2 py-2 rounded-sm" 
                on:click={()=>toggle_tag_inclusion(custom_tag)}>Add</button>
        
        <!-- Suggestions -->
        <h2 class="text-2xl mt-3 ms-2">Suggestions:</h2>
        <ul class="my-3 block">
            {#each tag_suggestions as suggestion_group}
                {#each suggestion_group as tag_name}
                    <li class="inline-block">
                        <button 
                        on:click={()=>{toggle_tag_inclusion(tag_name)}} 
                        class="mb-2 text-xl bg-light px-2 py-1 rounded-lg mx-1" 
                        class:bg-warn={current_tags.includes(tag_name)}>{tag_name}</button>
                    </li>
                {/each}
                <hr class="my-3"/>
            {/each}
        </ul>
    </div>
</main>
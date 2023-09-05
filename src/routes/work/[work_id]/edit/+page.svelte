<script lang="ts">
    import Header from '$lib/Header.svelte'
	import Button from '$lib/atom/Button.svelte';
	import Tag from '$lib/atom/Tag.svelte';
	import { get_tag_suggestions } from '$lib/helper';
	import type { work } from '$lib/types';
	import { onMount } from 'svelte';
    export let data : { work : work, all_work_tags: string[]}
    const work = data.work

    const tag_suggestions = get_tag_suggestions()
    const all_work_tags = data.all_work_tags;
    const misc_tags = all_work_tags.filter((tag_name)=>{
        for(let group_idx in tag_suggestions){
            if(tag_suggestions[group_idx].includes(tag_name)){
                return false
            }
        }
        return true
    })

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
        <Tag variant={1} size="lg"></Tag>
    </template>
    <template id="template-tag">
        <Tag variant={0} size="lg"></Tag>
    </template>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <Button onclick={()=>history.back()}>&larr; Return</Button>
        <h1 class="text-2xl font-bold mb-4">{work.name}</h1>
        <h2 class="mb-3 font-semibold">by {work.author_name}</h2>

        <!-- Current Tags-->
        <div class="bg-mid rounded-md h-32 leading-10 overflow-scroll"
             bind:this={current_tags_element} ></div>
        <Button onclick={submit_tags}>Submit &rarr;</Button>
        
        <!-- Custom Tags -->
        <h2 class="text-2xl mt-3 ms-2 mb-3">Add Tag:</h2>
        <input bind:value={custom_tag} class="bg-light rounded-md leading-10"/>
        <Button onclick={()=>toggle_tag_inclusion(custom_tag)}>Add</Button>
        
        <!-- Suggestions -->
        <h2 class="text-2xl mt-3 ms-2">Suggestions:</h2>
        <ul class="my-3 block">
            {#each tag_suggestions as suggestion_group}
                {#each suggestion_group as tag_name}
                    <li class="inline-block">
                        <Tag onclick={()=>{toggle_tag_inclusion(tag_name)}}
                            size="lg"
                            variant={current_tags.includes(tag_name)?1:0}>
                            {tag_name}
                        </Tag>
                    </li>
                {/each}
                <hr class="my-3"/>
            {/each}
            {#each misc_tags as tag_name}
            <li class="inline-block">
                <Tag onclick={()=>{toggle_tag_inclusion(tag_name)}}
                    variant={current_tags.includes(tag_name)?1:0}>
                    {tag_name}
                </Tag>
            </li>
        {/each}
        </ul>
    </div>
</main>
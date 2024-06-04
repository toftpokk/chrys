<script lang="ts">
	import ButtonLoad from '$lib/atom/ButtonLoad.svelte';
	import Tag from '$lib/atom/Tag.svelte';
	import { IsEmptySeries, emptyWork, get_tag_suggestions } from '$lib/helper';
	import { onMount } from 'svelte';
	import iconUpload from "$lib/icon/upload.svg?raw"
	import iconErase from "$lib/icon/erase.svg?raw"
	import iconDownload from "$lib/icon/download.svg?raw"
    export let data : import("./$types").PageData
    const work = data.work? data.work : emptyWork

    const tag_suggestions = get_tag_suggestions()
    const all_work_tags = Object.keys(data.all_work_tags);
    const unsorted_misc_tags = all_work_tags.filter((tag_name)=>{
        for(let group_idx in tag_suggestions){
            if(tag_suggestions[group_idx].tags.includes(tag_name)){
                return false
            }
        }
        return true
    })

    const misc_tags = unsorted_misc_tags.sort()

    let included_tags = [...work.tags]
    let current_tags = [...work.tags]
    let current_tags_element : HTMLElement;
    let current_series = work.series
    let current_name = work.name
    let current_path = work.path
    let paste_text = ""
    let series_list : string[] = data.series.map(s=>s.series_name)
    let custom_tag = ""
    
    // let tag_included : Record<string,boolean> = {}
    let submit_series_hidden = true
    async function submit_series(this: HTMLFormElement){
        submit_series_hidden = false
        const res = await fetch(`/api/${work.work_id}/series`,{
            method: 'POST',
            body: JSON.stringify(current_series),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        if(res.ok){
            submit_series_hidden = true
        }
        return // TODO error handling
    }

    let submit_tags_hidden = true
    async function submit_tags(this: HTMLFormElement){
        submit_tags_hidden = false
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
        submit_tags_hidden = true
        included_tags = [...current_tags]
        render_tags()
    }

    let save_name_hidden = true;
    async function save_name(this: HTMLFormElement){
        save_name_hidden = false
        const res = await fetch(`/api/${work.work_id}/rename`,{
            method: 'POST',
            body: JSON.stringify(current_name),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        if(!res.ok){
            return // TODO error handling
        }
        save_name_hidden = true
    }

    let save_path_hidden = true;
    async function save_path(this: HTMLFormElement){
        save_path_hidden = false
        const res = await fetch(`/api/${work.work_id}/rename_path`,{
            method: 'POST',
            body: JSON.stringify(current_path),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        if(!res.ok){
            return // TODO error handling
        }
        save_path_hidden = true
    }

    const export_tags = ()=>{
        paste_text = JSON.stringify(current_tags)
        render_tags()
    }
    const import_tags = ()=>{
        let paste_json = JSON.parse(paste_text)
        current_tags = paste_json
        render_tags()
    }
    const reset_tags = ()=>{
        // let paste_json = JSON.parse(included_tags)
        current_tags = included_tags
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

<svelte:head>
    <title>Edit - Chrys</title>
</svelte:head>
<main class="w-full" >
    <template id="template-tag-include">
        <Tag variant={"activated"}></Tag>
    </template>
    <template id="template-tag">
        <!-- TODO: Fix <Tag>-->
        <Tag variant={"default"}></Tag>
    </template>
    <div class="max-w-4xl flex flex-col px-2 mx-auto my-4 text-xl gap-3">
        <button class="text-start underline underline-offset-2 hover:text-gray-20 text-white" on:click={()=>history.back()}>&larr; Return</button>
        <div class="flex gap-1 h-9">
            <input bind:value={current_path} class="bg-gray-200 p-1 w-full text-xl"/>
            <ButtonLoad refresh={save_path} hidden={save_path_hidden}>
                Save&nbsp;Path
            </ButtonLoad>
        </div>
        <div class="flex gap-1 h-9">
            <input bind:value={current_name} class="bg-gray-200 p-1 w-full text-xl"/>
            <ButtonLoad refresh={save_name} hidden={save_name_hidden}>
                Save&nbsp;Name
            </ButtonLoad>
        </div>
        <p>by<span class=" bg-slate-600 px-2 p-1 rounded-xl">{work.author_name}</span></p>

        <!-- Current Tags-->
        <div class="flex mt-4 gap-1 text-black">
            <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-3" on:click={reset_tags}>{@html iconErase}</button>
            <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-3" on:click={export_tags}>{@html iconUpload}</button>
            <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-3" on:click={import_tags}>{@html iconDownload}</button>
            <input class="leading-10 grow mb-2 h-10 min-w-0 rounded-lg bg-gray-70 ps-2" placeholder="Tag Data" bind:value={paste_text}/>
        </div>
        <div class="flex flex-col">
            <div class="bg-gray-200 text-xl rounded-md h-48 leading-10 overflow-scroll my-2 p-3 py-4"
                bind:this={current_tags_element} ></div>
            <ButtonLoad refresh={submit_tags} hidden={submit_tags_hidden}>
                Save Tags
            </ButtonLoad>
        </div>


        <!-- Custom Tags -->
        <div class="block">
            <input placeholder="New Tag" bind:value={custom_tag} class="relative h-10 rounded-lg bg-gray-70 leading-10 px-2"/>
            <button class="absolute h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-2xl px-4 text-black" on:click={()=>toggle_tag_inclusion(custom_tag)}>+</button>
        </div>

        <!-- Suggestions -->
        <ul class="my-3 block">
            {#each tag_suggestions as suggestion_group}
                <p class="text-lg">{suggestion_group.name}</p>
                {#each suggestion_group.tags as tag_name}
                    <li class="inline-block">
                        <Tag onclick={()=>{toggle_tag_inclusion(tag_name)}}
                            size="lg"
                            variant={current_tags.includes(tag_name)?"activated":"deactivated"}>
                            {tag_name}
                        </Tag>
                    </li>
                {/each}
                <hr class="my-3"/>
            {/each}
            {#each misc_tags as tag_name}
                <li class="inline-block">
                    <Tag onclick={()=>{toggle_tag_inclusion(tag_name)}}
                        variant={current_tags.includes(tag_name)?"activated":"deactivated"}>
                        {tag_name}
                    </Tag>
                </li>
            {/each}
        </ul>
        <!-- Series -->
        <div class="flex flex-col">
            <select bind:value={current_series} class="text-xl pill bg-gray-50 overflow-hidden mb-2 inline-block px-2 py-2 rounded-lg mx-1 select-none bg-light">
                <option value="">-- Select a Series --</option>
                {#each series_list as s}
                    <option value={s}>{s}</option>
                {/each}
            </select>
            <input class="text-xl leading-10 mb-2 h-10 rounded-lg bg-gray-70 px-2 block py-1" bind:value={current_series}/>
            <ButtonLoad refresh={submit_series} hidden={submit_series_hidden}>
                Submit Series
            </ButtonLoad>
        </div>
    </div>
</main>
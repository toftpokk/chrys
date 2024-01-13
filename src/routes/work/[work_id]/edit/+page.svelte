<script lang="ts">
    import Header from '$lib/Header.svelte'
	import ButtonLoad from '$lib/atom/ButtonLoad.svelte';
	import Tag from '$lib/atom/Tag.svelte';
	import { IsEmptySeries, emptyWork, get_tag_suggestions } from '$lib/helper';
	import { onMount } from 'svelte';
    export let data : import("./$types").PageData
    const work = data.work? data.work : emptyWork

    const tag_suggestions = get_tag_suggestions()
    const all_work_tags = data.all_work_tags;
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
    let paste_text = ""
    let series_list : string[] = data.series.filter(s=>!IsEmptySeries(s))
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
<style>
    .head {
        @apply text-3xl leading-3 font-bold my-2;
    }
    .subhead{
        @apply text-2xl;
    }
</style>
<main class="w-full" >
    <Header/>
    <template id="template-tag-include">
        <Tag variant={"activated"}></Tag>
    </template>
    <template id="template-tag">
        <!-- TODO: Fix <Tag>-->
        <Tag variant={"default"}></Tag>
    </template>
    <div class="max-w-4xl flex flex-col px-2 mx-auto my-8 text-xl gap-3">
        <button class="text-start underline underline-offset-2 hover:text-gray-20 text-white" on:click={()=>history.back()}>&larr; Return</button>
        <div class="mb-4">
            <h1 class="text-3xl my-2">{work.name}</h1>
            <p>by <span class=" bg-slate-600 px-2 p-1 rounded-xl">{work.author_name}</span></p>
        </div>

        <!-- Current Tags-->
        <h2 class="head">Tags:</h2>
        <div class="flex flex-col">
            <div class="bg-gray-200 text-xl rounded-md h-64 leading-10 overflow-scroll my-4 p-3 py-4"
                bind:this={current_tags_element} ></div>
            <ButtonLoad refresh={submit_tags} hidden={submit_tags_hidden}>
                Submit Tags
            </ButtonLoad>
        </div>

        <div class="block mt-4">
            <input class="relative leading-10 mb-2 h-10 rounded-lg bg-gray-70" bind:value={paste_text}/>
            <div class="">
                <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-5" on:click={export_tags}>Export</button>
                <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-5" on:click={import_tags}>Import</button>
                <button class="h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-5" on:click={reset_tags}>Reset</button>
            </div>
        </div>

        <!-- Custom Tags -->
        <div class="block">
            <h2 class="subhead">New Tag:</h2>
            <input bind:value={custom_tag} class="relative h-10 rounded-lg bg-gray-70 leading-10"/>
            <button class="absolute h-10 bg-teal-100 hover:bg-teal-200 rounded-lg text-base px-5" on:click={()=>toggle_tag_inclusion(custom_tag)}>Add</button>
        </div>

        <!-- Suggestions -->
        <h2 class="subhead">Suggestions:</h2>
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
        <h2 class="head">Series:</h2>
        <div class="flex flex-col">
            <!-- <ul class="block my-4">
                {#each series_list as s}
                    <li class="inline-block">
                        Fix <Tag>
                        <Tag onclick={set_series(s)}
                            size="lg"
                            >{s}
                        </Tag>
                    </li>
                {/each}
            </ul> -->
            <select bind:value={current_series} class="overflow-hidden mb-2 inline-block px-4 py-2 rounded-lg mx-1 select-none bg-light">
                {#each series_list as s}
                    <option value={s}>{s}</option>
                {/each}
            </select>
            <input class="bg-mid block leading-10 mb-2 py-1" bind:value={current_series}/>
            <ButtonLoad refresh={submit_series} hidden={submit_series_hidden}>
                Submit Series
            </ButtonLoad>
        </div>
    </div>
</main>
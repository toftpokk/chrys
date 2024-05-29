<script lang="ts">
	import { page } from '$app/stores';
    import { env } from '$env/dynamic/public';
	import Icon from '$lib/Icon.svelte';
    import iconIndex from "$lib/icon/index.svg?raw"
    import Reactions from '$lib/Reactions.svelte'
	import { emptyWork, encodePathURI } from '$lib/helper';
    import type { work } from '$lib/types'
    export let data : import("./$types").PageData

    let work_id = ""
    $: work_id = $page.params.work_id

    let work : work = emptyWork
    $: work = data.work ? data.work : emptyWork
    let images_load : string[] = []
    $: images_load = work.images.slice(index, index+3)
    let previewImage : string[] = []

    // reset index on data change
    let index = 0
    $: index = data ? 0 : 0

    let author_url = ""
    $: author_url = `/author/${work.author_id}`

    let image_prefix = ""
    $: image_prefix = `${env.PUBLIC_IMAGE_SERVER}/images/${env.PUBLIC_IMAGE_REPO}/${encodePathURI(work.path)}`

    const prevIndex = ()=>{
        if(index > 0){
            index-=1
        }
    }
    const nextIndex = ()=>{
        if(index< work.images.length-1){
            index+=1
        }
    }

    const handleKeyDown = (event:KeyboardEvent)=>{
        if(event.key == "ArrowRight"){
            nextIndex()
        }
        if(event.key == "ArrowLeft"){
            prevIndex()
        }
    }

    const toggleView = async ()=>{
        const res = await fetch(`/api/${work_id}/viewed`,{
            method: 'POST',
            body: JSON.stringify({state: !work.viewed}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const results = await res.json()
        work.viewed = results.state
    }

    const toggleFav = async()=>{
        const res = await fetch(`/api/${work_id}/favorite`,{
            method: 'POST',
            body: JSON.stringify({state: !work.favorite}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const results = await res.json()
        work.favorite = results.state
    }
    // const toggleBookmark = async()=>{
    //     const res = await fetch(`/api/${work_id}/favorite`,{
    //         method: 'POST',
    //         body: JSON.stringify({state: !work.bookmark}),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const results = await res.json()
    //     work.favorite = results.state
    // }
    // Frontend
    
    let leftClose = true
    let rightClose = true

    const toggleLeftPane = ()=>{
        leftClose = !leftClose
    }
    const toggleRightPane = ()=>{
        rightClose = !rightClose
        if(!rightClose){
            previewImage = work.images
        }
    }
    const handleClick = (e: MouseEvent) => {
        const image = e.target as EventTarget & {width:number}
        const imageWidth = image.width
        const clickXPercent = (e.offsetX / imageWidth);
        if(clickXPercent > 0.5){
            nextIndex()
        }
        else{
            prevIndex()
        }
    };
</script>

<svelte:window on:keydown={handleKeyDown}/>
<svelte:head>
  {#each images_load as image}
    <link rel="preload" as="image" href={`${image_prefix}/${image}`} />
  {/each}
    <title>{work.name} - Chrys</title>
</svelte:head>

<div>
    <main>
        <!-- Sidebar -->
        <aside class:hidden={rightClose} class="grid grid-cols-3 gap-1 bg-gray-100 border-l border-gray-70 absolute h-screen right-0 z-10 px-8 pt-14 overflow-scroll">
            {#each previewImage as image, idx}
                <button class="" on:click={()=>index=idx}>
                    <img alt={image} src={`${image_prefix}/${image}`} class="border-teal-100" class:border-4={idx==index}>
                </button>
            {/each}
        </aside>
        <aside class:hidden={leftClose} class="bg-gray-100 border-r border-gray-70 absolute h-screen z-10 w-72 px-6 pt-14 overflow-scroll">
            <div>
                <h1 class="text-2xl font-bold my-2 overflow-clip">{work.name}</h1>
                <p class="my-1">Author: <a class="text-lg px-1.5 py-0.5 rounded-lg underline hover:text-gray-20" href={author_url}>{work.author_name}</a></p>
                <p class="my-1">Pages: <span class="text-lg  px-1.5 py-0.5 rounded-lg">{work.images.length}</span></p>
                {#if work.series}
                    <p>Series: <a class="text-lg px-1.5 py-0.5 rounded-lg underline hover:text-gray-20" href={"/series/"+work.series}>{work.series}</a></p>
                {/if}
            </div>
            <div>
                <Reactions favorite={work.favorite} viewed={work.viewed} on:toggleView={toggleView} on:toggleFav={toggleFav}/>
                <h2 class="font-bold text-lg mb-3">Tags</h2>
                <div class="block mb-4 max-h-[30%] overflow-y-scroll">
                    {#each work.tags as tag}
                        <button class="pill m-1 text-sm">{tag}</button>
                    {/each}
                </div>
                <a class="pill text-xl px-3 py-2 font-bold bg-gray-200" href={`/work/${work_id}/edit`}>Edit Tags &rarr;</a>
            </div>
            <div class="mt-4">
                {#if data.similar.length > 0}
                    <h2 class="font-bold text-lg mb-3">Similar Works:</h2>
                {/if}
                <div class="flex flex-wrap gap-1 justify-around">
                    {#each data.similar as sim}

                        <a class="my-1 w-5/12" href={`/work/${sim.work_id}`}>
                            <div class="">
                                <img loading="lazy" alt={sim.name} src={`${env.PUBLIC_IMAGE_SERVER}/images/${env.PUBLIC_IMAGE_REPO}/${encodePathURI(sim.path)}/${sim.cover}`}/>
                                <p>{sim.name}</p>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        </aside>
        <div class="grow overflow-scroll h-full">
            <div class="flex justify-between mb-3">
                <div class="z-10">
                    <button on:click={toggleLeftPane} class="touch-none select-none text-right text-xl px-4 py-2 pill">&rarr;</button>
                    <a href="/" class="touch-none select-none text-right text-xl px-4 py-2 pill">
                        <Icon src={iconIndex} color={false ? "#949daa" : "#FFF"} size={16}/>
                    </a>
                </div>
                <button on:click={toggleRightPane} class="touch-none select-none text-left text-xl px-4 py-2 pill z-10">{(index+1)+"/"+work.images.length}</button>
            </div>
            <div class="flex justify-center h-full">
                <button on:click={handleClick} class="object-fit h-full">
                    <img class="object-fit max-h-full" draggable="false" src={ `${image_prefix}/${work.images[index]}` } alt="page"/>
                </button>
            </div>
        </div>
    </main>
</div>
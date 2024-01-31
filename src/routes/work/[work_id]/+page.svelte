<script lang="ts">
	import { page } from '$app/stores';
    import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
    import Reactions from '$lib/Reactions.svelte'
	import Tag from '$lib/atom/Tag.svelte';
	import { emptyWork } from '$lib/helper';
    import type { work } from '$lib/types'
    export let data : import("./$types").PageData

    const work_id = $page.params.work_id
    let work : work = data.work ? data.work : emptyWork
    let author_url = ""
    let images_load : string[] = []
    $: images_load = work.images.slice(index, index+3)
    let index = 0
    let image_prefix = ""
    let author_comp = ""
    let work_comp = ""
    let previewImage : string[] = []

    if(data.work){
        author_url = `/author/${data.work.author_id}`
        
        author_comp = encodeURIComponent(work.author_name)
        work_comp = encodeURIComponent(work.name)

        image_prefix = `${PUBLIC_IMAGE_SERVER}/images/${PUBLIC_IMAGE_REPO}/${author_comp}/${work_comp}`
    }

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
        </aside>
        <div class="grow overflow-scroll h-full">
            <div class="flex justify-between mb-3">
                <button on:click={toggleLeftPane} class="touch-none select-none text-right text-xl px-4 py-2 pill z-10">&rarr;</button>
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
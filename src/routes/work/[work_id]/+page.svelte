<script lang="ts">
	import { page } from '$app/stores';
    import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
    import Reactions from '$lib/Reactions.svelte'
	import Button from '$lib/atom/Button.svelte';
	import Tag from '$lib/atom/Tag.svelte';
    import type { work } from '$lib/types'
    export let data : {work:work|null};

    const work_id = $page.params.work_id
    let work : work = data.work ? data.work : {
        work_id: Number(work_id),
        name: "Unnamed Work",
        path: "",
        author_id: -1,
        favorite: false,
        viewed: false,
        tags: [],
        author_name: "Unnamed Author",
        images: []
    }
    let author_url = ""
    let images_load : string[] = []
    $: images_load = work.images.slice(index, index+3)
    let index = 0
    let image_prefix = ""
    let author_comp = ""
    let work_comp = ""

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
    // Frontend
    
    let leftClose = true

    const toggleLeftPane = ()=>{
        leftClose = !leftClose
    }

    const handleClose = ()=>{
        asideClass = "collapse"
        buttonClass = ""
    }
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
        <aside class:collapse={leftClose} class="absolute bg-mid h-screen z-10 w-72">
            <div class="px-6 mt-14">
                <!-- Details -->
                <div>
                    <h1 class="text-2xl font-bold my-2 overflow-clip">{work.name}</h1>
                    <p>Author: <a class="text-lg" href={author_url}>{work.author_name}</a></p>
                    <p>Pages: <span class="text-lg">{work.images.length}</span></p>
                </div>
                <div>
                    <Reactions favorite={work.favorite} viewed={work.viewed} on:toggleView={toggleView} on:toggleFav={toggleFav}/>
                    <h2 class="font-bold text-lg mb-3">Tags</h2>
                    <!-- Tags -->
                    <div class="block mb-4">
                        {#each work.tags as tag}
                            <Tag href={"/tag/"+tag}>{tag}</Tag>
                        {/each}
                    </div>

                    <Button href={`/work/${work_id}/edit`}>Edit Tags &rarr;</Button>
                </div>
            </div>
        </aside>
        <div class="grow text-light overflow-scroll h-screen">
            <div class="grow flex justify-center h-screen">
                <img class="object-contain" src={ `${image_prefix}/${work.images[index]}` } alt="page"/>
            </div>
            <div class="absolute text-white left-0 top-0 z-10">
                <button on:click={toggleLeftPane} class="touch-none select-none text-right text-xl px-4 py-2 bg-light">&rarr;</button>
            </div>
            <div class="absolute text-white text-right right-0 top-0 z-10">
                <button class="touch-none select-none text-left text-xl px-4 py-2 bg-light">{(index+1)+"/"+work.images.length}</button>
            </div>
            <div role="button" on:keydown={prevIndex} tabindex="0" on:click={prevIndex} class="touch-none w-[45%] fixed  h-screen bottom-0">
            </div>
            <div role="button" on:keydown={nextIndex} tabindex="0" on:click={nextIndex} class="touch-none w-[45%] fixed  h-screen bottom-0 right-0">
            </div>
        </div>
    </main>
</div>
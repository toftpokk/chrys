<script lang="ts">
    import { image_server } from '$lib/consts';
    import type { work } from '../../../lib/types'
    export let data : {work:work|null};

    let work_name = "Unnamed Work";
    let author_name = "Unnamed Author";
    let author_url = ""
    let images : string[]= []
    let index = 0
    let image_prefix = ""
    let author_comp = ""
    let work_comp = ""


    if(data.work){
        console.log(data.work.tags)
        work_name = data.work.name
        author_name = data.work.author_name
        author_url = `/author/${data.work.author_id}`
        images = data.work.images
        
        author_comp = encodeURIComponent(author_name)
        work_comp = encodeURIComponent(work_name)

        image_prefix = `${image_server}/images/works/${author_comp}/${work_comp}`
    }

    const prevIndex = ()=>{
        if(index > 0){
            index-=1
        }
    }
    const nextIndex = ()=>{
        if(index< images.length-1){
            index+=1
        }
        console.log("next")
    }

    const handleKeyDown = (event:KeyboardEvent)=>{
        if(event.key == "ArrowRight"){
            nextIndex()
        }
        if(event.key == "ArrowLeft"){
            prevIndex()
        }
    }

    // Frontend
    
    let buttonClass = ""
    let asideClass = "collapse"

    const handleOpen = ()=>{
        asideClass = ""
        buttonClass = "collapse"
    }

    const handleClose = ()=>{
        asideClass = "collapse"
        buttonClass = ""
    }
</script>

<svelte:window on:keydown={handleKeyDown}/>

<div>
    <main>
        <!-- Sidebar -->
        <div class="{buttonClass} absolute left-0 top-0 z-10">
            <button on:click={handleOpen} class="touch-none select-none text-right text-xl px-4 py-2 bg-light">&rarr;</button>
        </div>
        <aside class="{asideClass} absolute bg-mid h-screen z-10 w-72">
            <div class="text-left left-0 top-0 relative">
                <button on:click={handleClose} class="touch-none select-none text-right text-xl px-4 py-2 bg-light">&larr;</button>
            </div>
            <div class="px-6">
                <!-- Details -->
                <div>
                    <h1 class="text-2xl font-bold my-2 overflow-clip">{work_name}</h1>
                    <p>Author: <a class="text-lg" href={author_url}>{author_name}</a></p>
                    <p>Pages: <span class="text-lg">{images.length}</span></p>
                </div>
                <div>
                    <h2 class="font-bold text-lg mb-3">Tags</h2>
                    <ul>
                        <!-- Tags -->
                        <!-- {#each tags as tag}
                            
                        {/each} -->
                        <!-- {w?w.tags.map(t=>
                            <a href={"/tag/"+t} class="bg-light px-2 py-1 rounded-lg mx-1">{t}</a>
                        ):<></>} -->
                    </ul>
                </div>
            </div>
        </aside>
        <div class="grow text-light overflow-scroll h-screen">
            <div class="grow flex justify-center h-screen">
                <img class="object-contain" src={ `${image_prefix}/${images[index]}` } alt="Im"/>
            </div>
            <div class="absolute text-white text-right right-0 top-0 z-10">
                <button class="w-16 touch-none select-none text-left text-xl px-4 py-2 bg-light">{(index+1)+"/"+images.length}</button>
            </div>
            <div role="button" on:keydown={prevIndex} tabindex="0" on:click={prevIndex} class="touch-none min-w-[20%] fixed  h-screen bottom-0">
            </div>
            <div role="button" on:keydown={nextIndex} tabindex="0" on:click={nextIndex} class="touch-none min-w-[20%] fixed  h-screen bottom-0 right-0">
            </div>
        </div>
    </main>
</div>
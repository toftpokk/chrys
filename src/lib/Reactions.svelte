<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    export let favorite = false
    export let viewed = false
    export let bookmark = false
    const toggleFav = ()=>{
        dispatch('toggleFav')
    }
    const toggleView = ()=>{
        dispatch('toggleView')
    }
    const toggleBookmark = ()=>{
        dispatch('toggleBookmark')
    }
</script>
<div class="flex my-1">
    <input on:click={toggleFav} type="image" alt="favorite" class="cursor-pointer h-7 my-3 mx-2" src={favorite ? "/icon-heart-on.svg": "/icon-heart.svg"}/>
    <input on:click={toggleBookmark} type="image" alt="favorite" class="cursor-pointer h-7 my-3 mx-2" src={bookmark ? "/icon-bookmark-on.svg": "/icon-bookmark.svg"}/>
    <input on:click={toggleView} type="image" alt="viewed" class="cursor-pointer h-7 my-3 mx-2" src={viewed ? "/icon-eye-on.svg": "/icon-eye.svg"}/>
</div>
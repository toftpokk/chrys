<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    export let favorite = false
    const toggleFav = ()=>{
        dispatch('toggleFav')
    }
</script>
<div class="flex my-1">
    <input on:click={toggleFav} type="image" alt="favorite" class="cursor-pointer h-7 my-3 mx-2" src={favorite ? "/icon-heart-on.svg": "/icon-heart.svg"}/>
</div>
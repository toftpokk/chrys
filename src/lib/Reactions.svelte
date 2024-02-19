<script lang="ts">
    import { createEventDispatcher } from 'svelte'
	import iconHeart from "$lib/icon/heart.svg?raw"
	import iconEye from "$lib/icon/eye.svg?raw"
	import Icon from './Icon.svelte';
    const dispatch = createEventDispatcher()
    export let favorite = false
    export let viewed = false
    // export let bookmark = false
    const toggleFav = ()=>{
        dispatch('toggleFav')
    }
    const toggleView = ()=>{
        dispatch('toggleView')
    }
    // const toggleBookmark = ()=>{
    //     dispatch('toggleBookmark')
    // }
</script>
<div class="flex my-1">
    <button on:click={toggleFav}>
        <Icon
            src={iconHeart}
            color={favorite?"#EEE":"#535A65"}
            margin="0 0.5rem"
        />
    </button>
    <!-- <input on:click={toggleBookmark} type="image" alt="favorite" class="cursor-pointer h-7 my-3 mx-2" src={bookmark ? "/icon-bookmark-on.svg": "/icon-bookmark.svg"}/> -->
    <button on:click={toggleView}>
    <Icon
        src={iconEye}
        color={viewed?"#EEE":"#535A65"}
        margin="0 0.5rem"
    />
    </button>
</div>
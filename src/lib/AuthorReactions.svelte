<script lang="ts">
    import { createEventDispatcher } from 'svelte'
	import Icon from './Icon.svelte';
    import iconHeart from "$lib/icon/heart.svg?raw"
    const dispatch = createEventDispatcher()
    export let favorite = false
    const toggleFav = ()=>{
        dispatch('toggleFav')
    }
</script>
<button on:click={toggleFav} class="flex my-1">
    <Icon src={iconHeart} size={35} color={favorite?"#EEE":"#535A65"}/>
</button>
<script lang="ts">
	import { goto } from '$app/navigation';
    import Header from '$lib/Header.svelte'
	import Button from '$lib/atom/Button.svelte';
    export let data : {alpha: string[]}
    const handleSubmit = ()=>{
        const input = document.getElementById("search") as HTMLInputElement | null
        if(input){
            const encoded = encodeURIComponent(input.value)
            goto("/alpha/"+encoded)
        }
    }
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Authors</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each data.alpha as char}
                <a href={"/alpha/"+encodeURIComponent(char)} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{char}</a>
            {/each}
        </div>
        <input id="search" class="text-black"/>
        <Button onclick={handleSubmit}>Search</Button>
    </div>
</main>
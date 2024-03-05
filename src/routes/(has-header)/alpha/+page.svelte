<script lang="ts">
    export let data : import("./$types").PageData
    const handleSubmit = (e: Event)=>{
        const input = document.getElementById("search") as HTMLInputElement | null
        if(input){
            const encoded = encodeURIComponent(input.value)
            // goto("/alpha/"+encoded)
            let destination = "/alpha/"+encoded as any
            window.location = destination
        }
    }
</script>
<svelte:head>
    <title>Search - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Search</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each data.alpha as char}
                <a href={"/alpha/"+encodeURIComponent(char)} class="pill w-8 text-center mb-2 rounded-lg mx-1">{char}</a>
            {/each}
        </div>
        <form on:submit={handleSubmit}>
            <input id="search" class="h-10 text-black"/><input class="multipill pill h-10 pb-2" type="submit" value="Search"/>
        </form>
    </div>
</main>
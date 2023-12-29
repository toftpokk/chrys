<script lang="ts">
    import Header from '$lib/Header.svelte'
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
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Authors</h1>
    <div class="max-w-7xl flex flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each data.alpha as char}
                <a href={"/alpha/"+encodeURIComponent(char)} class="mb-2 text-xl inline-block bg-light px-2 py-1 rounded-lg mx-1">{char}</a>
            {/each}
        </div>
        <form on:submit={handleSubmit}>
            <input id="search" class="h-10 text-black" />
            <input class="btn" type="submit" value="Search"/>
        </form>
    </div>
</main>
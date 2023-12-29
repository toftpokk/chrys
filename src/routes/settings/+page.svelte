<script lang="ts">
    import Header from "$lib/Header.svelte";

    let hidden = true

    const refresh = async()=>{
        hidden = false
        const res = await 
        fetch(`/api/refresh`).then(()=>{
            hidden = true
        }).catch((e)=>{
            // TODO catch error
        })
    }
</script>
<main class="w-full">
    <Header/>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">Settings</h1>
        <div class="inline">
            <a class="btn" href="/export/favorite" download>Export Favorites &DoubleRightArrow;</a>
            <a class="btn" href="/export/viewed" download>Export Viewed &DoubleRightArrow;</a>
            <button class="btn" on:click={()=>refresh()}>
                Refresh <img class="icon inline w-5 -mt-1" class:hidden={hidden} src="/refresh.svg"/>
            </button>
        </div>
    </div>
</main>
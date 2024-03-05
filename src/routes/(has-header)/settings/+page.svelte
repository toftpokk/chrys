<script lang="ts">
	import ButtonLoad from "$lib/atom/ButtonLoad.svelte";

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
<svelte:head>
    <title>Settings - Chrys</title>
</svelte:head>
<main class="w-full">
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">Settings</h1>
        <div class="inline">
            <a class="pill" href="/export/favorite" download>Export Favorites <span class="pill-icon">&darr;</span></a>
            <a class="pill" href="/export/viewed" download>Export Viewed <span class="pill-icon">&darr;</span></a>
            <ButtonLoad refresh={refresh} hidden={hidden}>
                Refresh
            </ButtonLoad>
        </div>
    </div>
</main>
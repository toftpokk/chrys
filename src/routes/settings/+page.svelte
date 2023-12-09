<script lang="ts">
    import Header from "$lib/Header.svelte";
	import Button from "$lib/atom/Button.svelte";

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
            <Button href="/export/favorite" download>Export Favorites &DoubleRightArrow;</Button>
            <Button href="/export/viewed" download>Export Viewed &DoubleRightArrow;</Button>
            <Button onclick={()=>refresh()} download>Refresh <img class="icon inline w-5 -mt-1" class:hidden={hidden} src="/refresh.svg"/></Button>
        </div>
    </div>
</main>
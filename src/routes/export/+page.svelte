<script lang="ts">
    import Header from "$lib/Header.svelte";
	import Button from "$lib/atom/Button.svelte";

    const refresh = async()=>{
        const res = await fetch(`/api/refresh`)
    }
</script>
<main class="w-full">
    <Header/>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">Export</h1>
        <div class="inline">
            <Button href="/export/favorite" download>Export Favorites &DoubleRightArrow;</Button>
            <Button href="/export/viewed" download>Export Viewed &DoubleRightArrow;</Button>
            <Button onclick={()=>refresh()} download>Refresh</Button>
        </div>
    </div>
</main>
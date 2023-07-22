<script lang="ts">
    import Header from "$lib/Header.svelte";
</script>
<main class="w-full my-6" >
    <Header/>
    <div class="max-w-4xl block mx-auto my-8 text-xl">
        <h1 class="text-2xl font-bold mb-4">Export</h1>
        <div class="inline">
            <a class="text-xl font-bold bg-light px-2 py-1 mx-2" href="/export/favorite" download="">Export Favorites &DoubleRightArrow;</a>
            <a class="text-xl font-bold bg-light px-2 py-1" href="/export/viewed" download="">Export Viewed &DoubleRightArrow;</a>
        </div>
    </div>
</main>
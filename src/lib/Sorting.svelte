<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { sort_type } from "./consts";
    const searchParams = $page.url.searchParams
    
    let current_sort : string;

    $:{
        current_sort  = searchParams.get("sort") || "default";
    }
    function change_sort(){
        const u = new URLSearchParams($page.url.searchParams)
        u.set("page","1") // reset page
        u.set("sort",current_sort)
        goto("?"+u.toString())
    }
</script>
<form class="max-w-xs mx-12 px-4 py-3">
    <label class="block mb-2 font-bold" for="sort">Sorting</label>
    <select class="bg-main py-2 px-3 block w-full mb-3" id="sort" bind:value={current_sort} on:change={change_sort}>
        {#each sort_type as t }
            <option value={t}>{t}</option>
        {/each}
    </select>
</form>
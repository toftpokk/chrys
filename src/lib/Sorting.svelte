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
<div class="max-w-7xl mx-auto flex justify-start py-3">
    <label class="text-xl mx-2" for="sort">Sort:</label>
    <select name="sort" id="sort" class="bg-main px-3 py-2" bind:value={current_sort} on:change={change_sort}>
        {#each sort_type as t }
            <option value={t}>{t}</option>
        {/each}
    </select>
</div>
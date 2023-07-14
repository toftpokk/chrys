<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { sort_type } from "./consts";
	import { browser } from '$app/environment';
    const searchParams = $page.url.searchParams
    
    let current_sort = "default"
    $: if (browser){
    let searchParamSort = searchParams.get("sort")
        if (current_sort !== searchParamSort){
            if (!(current_sort === "default" && searchParamSort === null)){
                searchParams.set("sort",current_sort)
                goto("?"+searchParams.toString())
            }
        }
    }
</script>
<div class="max-w-7xl mx-auto flex justify-start py-3">
    <label class="text-xl mx-2" for="sort">Sort:</label>
    <select name="sort" id="sort" class="bg-main px-3 py-2" bind:value={current_sort}>
        {#each sort_type as t }
            <option value={t}>{t}</option>
        {/each}
    </select>
</div>
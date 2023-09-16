<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { sort_type } from "./consts";
    export let filterView = false;
    const searchParams = $page.url.searchParams
    
    let current_sort : string;
    let hasViewed = false;
    $:{
        current_sort  = searchParams.get("sort") || "random";
        hasViewed = searchParams.get("has-viewed")==="true" ? true : false;
    }
    
    function change_sort(){
        const u = new URLSearchParams($page.url.searchParams)
        u.set("page","1") // reset page
        u.set("sort",current_sort)

        // view filter available only when filterView is true
        if(filterView){
            u.set("has-viewed",String(hasViewed))
        }
        else{
            if(u.get("has-viewed")){
                u.delete("has-viewed")
            }
        }
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
    {#if filterView}
        <input type="checkbox" class="bg-main py-2 px-3 inline w-4 h-4" id="hasViewed" 
            bind:checked={hasViewed} on:change={change_sort}/>
        <label class="mb-2" for="hasViewed">Viewed Items</label>
    {/if}
</form>
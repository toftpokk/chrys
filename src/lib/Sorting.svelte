<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { sort_type } from "./consts";
    export let hasFilters = false;
    const searchParams = $page.url.searchParams
    
    let current_sort : string;
    let hasViewed = false;
    let hasCompilation = false;
    $:{
        current_sort  = searchParams.get("sort") || "random";
        hasViewed = searchParams.get("has-viewed")==="true" ? true : false;
        hasCompilation = searchParams.get("has-compilation")==="true" ? true : false;
    }
    
    function change_sort(){
        const u = new URLSearchParams($page.url.searchParams)
        u.set("page","1") // reset page
        u.set("sort",current_sort)

        // view filter available only when hasFilters is true
        if(hasFilters){
            u.set("has-viewed",String(hasViewed))
            u.set("has-compilation",String(hasCompilation))
        }
        else{
            if(u.get("has-viewed")){
                u.delete("has-viewed")
            }
            if(u.get("has-compilation")){
                u.delete("has-compilation")
            }
        }
        window.location = ("?"+u.toString()) as any
    }
</script>
<form class="max-w-xs mx-12 px-4 py-3">
    <p class="block mb-2 font-bold">Sorting</p>
    <select class="w-full mb-3 pill py-2" id="sort" bind:value={current_sort} on:change={change_sort}>
        {#each sort_type as t }
            <option value={t}>{t}</option>
        {/each}
    </select>
    {#if hasFilters}
        <div class="mb-2">
            <input bind:checked={hasViewed} on:change={change_sort} class="scale-150 outline-none accent-teal-100 me-3" width="100" id="hasViewed" type="checkbox"/>
            <label for="hasViewed">Show Viewed Items</label>
        </div>
        <div class="mb-2">
            <input bind:checked={hasCompilation} on:change={change_sort} class="scale-150 outline-none accent-teal-100 me-3" width="100" id="hasCompilation" type="checkbox"/>
            <label for="hasCompilation">Show Compilations</label>
        </div>
    {/if}
</form>
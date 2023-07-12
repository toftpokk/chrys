<script lang="ts">
	import { sort_type } from "./consts";
    export let sort : string
    export let search_params : URLSearchParams
    const new_search_params = new URLSearchParams(search_params)

    const next_sort = ()=>{
        const n_idx = sort_type.indexOf(sort)
        const next_sort = sort_type[n_idx+1]
        if(next_sort){
            return next_sort
        }
        else{
            return sort_type[0]
        }
    }
    new_search_params.set("sort",next_sort())
    const sort_url = "?"+new_search_params.toString()
</script>
<div class="max-w-7xl mx-auto flex justify-end py-3">
    <a class="inline-block text-xl bg-light px-2 py-1 select-none" data-sveltekit-reload href={sort_url}>Sort by: <span class="font-bold">{sort}</span></a>
</div>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

    export let max : number;

    const get_page = (searchParams: URLSearchParams)=>{
        const page_str = searchParams.get("page")
        return page_str ? Number(page_str) : 1
    }

    const searchParams = $page.url.searchParams
    let leftHidden = true;
    let rightHidden = true;
    let page_num = get_page(searchParams)

    // Left/right arrows
    $: {
        leftHidden = !(page_num > 1)
        rightHidden = !(max < 0 || page_num < max)
    }
    
    // Left/right function
    const goto_prev = ()=>{
        searchParams.set("page",String(page_num-1))
        goto("?"+searchParams.toString())
        page_num = get_page(searchParams)
    }
    const goto_next = ()=>{
        searchParams.set("page",String(page_num+1))
        goto("?"+searchParams.toString())
        page_num = get_page(searchParams)
    }
</script>

<div class="max-w-7xl flex justify-center text-4xl mx-auto my-2">
    <button class="w-8 {leftHidden? "invisible":""}" on:click={goto_prev}>&larr;</button>
    <span class="text-3xl w-10 mx-6 text-center">{page_num}</span>
    <button class="w-8 {rightHidden? "invisible":""}" on:click={goto_next}>&rarr;</button>
</div>
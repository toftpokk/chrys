<script lang="ts">
    export let page : number;
    export let max : number;
    export let search_params: URLSearchParams;
    const new_search_params = new URLSearchParams(search_params)
    let leftHidden = true;
    let rightHidden = true;
    
    // previous url
    new_search_params.set("page",String(page-1))
    const prev_url = "?"+new_search_params.toString()

    // next url
    new_search_params.set("page",String(page+1))
    const next_url = "?"+new_search_params.toString()

    if(page > 1){
        leftHidden = false
    }
    if(max < 0 || page < max){
        rightHidden = false
    }
</script>
<div class="max-w-7xl flex justify-center text-4xl mx-auto my-2">
    <a data-sveltekit-reload class="w-8 {leftHidden? "invisible":""}" href={prev_url}>&larr;</a>
    <span class="text-3xl w-10 mx-6 text-center">{page}</span>
    <a data-sveltekit-reload class="w-8 {rightHidden? "invisible":""}" href={next_url}>&rarr;</a>
</div>
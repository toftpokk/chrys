<script lang="ts">
    export let max : number;
    export let page_num : number;

    let leftHidden = true;
    let rightHidden = true;

    // Left/right arrows
    $: {
        leftHidden = !(page_num > 1)
        rightHidden = !(max < 0 || page_num < max)
    }
    
    // Left/right function
    const goto_prev = ()=>{
        if(page_num > 1){
            page_num-=1
        }
        else{
            page_num = 1
        }
    }
    const goto_next = ()=>{
        if(max < 0 || page_num < max){
            page_num+=1
        }
        else{
            page_num = max
        }
    }
</script>

<div class="max-w-7xl flex justify-center text-4xl mx-auto my-2">
    <button class="w-8 {leftHidden? "invisible":""}" on:click={goto_prev}>&larr;</button>
    <span class="text-3xl w-10 mx-6 text-center">{page_num}</span>
    <button class="w-8 {rightHidden? "invisible":""}" on:click={goto_next}>&rarr;</button>
</div>
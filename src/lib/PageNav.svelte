<script lang="ts">
    export let page : number;
    export let max : number;
    let leftHidden = true;
    let rightHidden = true;

    if(page > 1){
        leftHidden = false
    }
    if(max < 0 || page < max){
        rightHidden = false
    }

</script>
<div class="max-w-7xl flex justify-center text-4xl mx-auto my-2">
    <a data-sveltekit-reload class="w-8 {leftHidden? "hidden":""}" href={"?page="+(page-1)}>&larr;</a>
    <span class="text-3xl w-10 mx-6 text-center">{page}</span>
    <a data-sveltekit-reload class="w-8 {rightHidden? "hidden":""}" href={"?page="+(page+1)}>&rarr;</a>
</div>
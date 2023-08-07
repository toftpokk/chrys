<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { get_page } from "./helper";

    export let max : number;

    let leftHidden = true;
    let rightHidden = true;

    let leftUrl = ""
    let rightUrl = ""
    let page_num = 1
    $:{
        page_num = get_page($page.url.searchParams);
        leftHidden = !(page_num > 1)
        rightHidden = !(max < 0 || page_num < max)

        const u = new URLSearchParams($page.url.searchParams)
        u.set("page",String(page_num-1))
        leftUrl = "?"+u.toString()
        u.set("page",String(page_num+1))
        rightUrl = "?"+u.toString()
    }

</script>

<div class="max-w-7xl flex justify-center text-4xl mx-auto my-2">
    <a class:invisible={leftHidden} class="w-8" href={leftUrl}>&larr;</a>
    <span class="text-3xl w-10 mx-6 text-center">{page_num}</span>
    <a class:invisible={rightHidden} class="w-8" href={rightUrl}>&rarr;</a>
</div>
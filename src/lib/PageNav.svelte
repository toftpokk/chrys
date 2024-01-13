<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { get_page } from "./helper";

    export let max : number;

    let leftMaxHidden = true;
    let leftHidden = true;
    let rightHidden = true;
    let rightMaxHidden = true;

    let leftUrl = ""
    let leftMaxUrl = ""
    let rightUrl = ""
    let rightMaxUrl = ""
    let page_num = 1
    $:{
        page_num = get_page($page.url.searchParams);
        leftHidden = !(page_num > 1)
        leftMaxHidden = (page_num == 1)
        rightHidden = !(max < 0 || page_num < max)
        rightMaxHidden = (page_num == max)

        const u = new URLSearchParams($page.url.searchParams)
        u.set("page",String(1))
        leftMaxUrl = "?"+u.toString()
        u.set("page",String(page_num-1))
        leftUrl = "?"+u.toString()
        u.set("page",String(max))
        rightMaxUrl = "?"+u.toString()
        u.set("page",String(page_num+1))
        rightUrl = "?"+u.toString()
    }

</script>

<div class="flex justify-center text-4xl mx-auto my-2">
    <a class:invisible={leftMaxHidden} class="pill mx-1" href={leftMaxUrl}>&laquo; First</a>
    <a class:invisible={leftHidden} class="pill px-3 pb-1.5 mx-1" href={leftUrl}>&laquo;</a>
    <span class="text-2xl my-1 mx-4 w-[3ch] text-center">{page_num}</span>
    <a class:invisible={rightHidden} class="pill px-3 pb-1.5 mx-1" href={rightUrl}>&raquo;</a>
    <a class:invisible={rightMaxHidden} class="pill mx-1" href={rightMaxUrl}>Last &raquo;</a>
</div>
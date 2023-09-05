<script lang="ts">
import { goto } from "$app/navigation";
export let onclick : Function = ()=>{};
export let href : string|null = null;
// If href, override onclick
if(typeof href === "string"){
    const link = href
    onclick = ()=>goto(link);
}
</script>
<button on:click={()=>onclick()} {...$$restProps}
    class="text-xl bg-red-500 font-bold px-3 py-2 select-none touch-none">
    <slot/>
</button>
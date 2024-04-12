<script lang="ts">
import { goto } from "$app/navigation";
export let onclick : Function = ()=>{};
export let href : string|null = null;
export let variant = "default";

// variant 0 default
// variant 1, activated
// variant 2, deactivated
// variant 3, removed

// If href, override onclick
if(typeof href === "string"){
    const link = href
    onclick = ()=>goto(link);
}
</script>
<button
on:click={()=>{onclick()}} {...$$restProps}
    class="pill m-0.5 sm:text-lg text-[1rem]"
    class:bg-gray-70={variant=="default"}
    class:border-gray-80={variant == "default"||variant == "activated"}
    class:bg-teal-100={variant == "activated"}
    class:bg-gray-100={variant == "deactivated"}
    class:bg-red-100={variant == "removed"}
>
    <slot/>
</button>
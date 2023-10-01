<script lang="ts">
import { goto } from "$app/navigation";
export let onclick : Function = ()=>{};
export let href : string|null = null;
export let variant = 0;
export let size = "sm";

// variant 0 default
// variant 1, bg-warn
// variant 2, bg-ligt

// If href, override onclick
if(typeof href === "string"){
    const link = href
    onclick = ()=>goto(link);
}
</script>
<button on:click={()=>{onclick()}} {...$$restProps}
    class="mb-2 inline-block px-2 py-1 rounded-lg mx-1 select-none touch-none"
    class:bg-light={variant == 0 || variant == 2}
    class:text-mid={variant == 2}
    class:bg-warn={variant == 1}
    class:text-sm={size == "sm"}
    class:text-lg={size == "lg"}
    >
    <slot/>
</button>
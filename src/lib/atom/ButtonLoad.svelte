<script lang="ts">
    export let refresh : Function
    export let hidden : boolean
</script>
<button class="pill box-border x" on:click={()=>refresh()}>
    <!-- <slot></slot><img class="inline-block w-4 ms-2 pb-1" alt="reloading" class:hidden={false} src="/refresh.svg"/> -->
    <slot></slot> <span class="pill-icon" class:hidden={hidden}>&orarr;</span>
</button>
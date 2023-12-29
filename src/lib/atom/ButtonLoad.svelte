<script lang="ts">
    export let refresh : Function
    export let hidden = true
</script>
<button class="btn box-border x" on:click={()=>refresh()}>
    <slot></slot><img class="inline-block w-4" alt="reloading" class:hidden={hidden} src="/refresh.svg"/>
</button>
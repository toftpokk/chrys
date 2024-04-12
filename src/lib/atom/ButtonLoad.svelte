<script lang="ts">
    export let refresh : Function
    export let hidden : boolean
</script>
<button class="pill box-border x" on:click={()=>refresh()}>
    <slot></slot>&nbsp;<span class="pill-icon" class:hidden={hidden}>&orarr;</span>
</button>
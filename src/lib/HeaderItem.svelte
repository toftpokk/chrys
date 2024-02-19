<script lang="ts">
    import Icon from '$lib/Icon.svelte'
    export let icon : string
    export let active : boolean = false
    export let name : string
    export let url : string
</script>
<li class="m-3 inline-block link text-white" class:text-gray-20={active}>
    <a class="text-lg" href={url}>
        <Icon src={icon} color={active ? "#949daa" : "#FFF"} size={16}/>
        <span class="align-middle hidden md:inline">{name}</span>
    </a>
</li>
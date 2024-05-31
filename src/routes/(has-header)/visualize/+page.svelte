<script>

	import Vis from "./Vis.svelte";
    export let data
</script>
<div class="h-[90em] ">
    <Vis data={data.graph}/>
</div>
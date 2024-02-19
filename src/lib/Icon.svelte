<script lang="ts">
	export let src: string;
	export let color: string = '#5CC5A9';
	export let size = 24;
</script>

<div style="--icon-size: {size}px; --icon-color: {color}; display: contents;">
	{@html src}
</div>

<style>
	div > :global(svg) {
		height: var(--icon-size);
		width: var(--icon-size);
		color: var(--icon-color);
		display: inline-block;
	}
</style>

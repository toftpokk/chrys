<script lang="ts">
	export let src: string;
	export let color: string = '#535A65';
	export let size = 24;
	export let margin = ""
</script>

<div style="--icon-size: {size}px; --icon-color: {color}; --icon-margin: {margin}; display: contents;">
	{@html src}
</div>

<style>
	div > :global(svg) {
		height: var(--icon-size);
		width: var(--icon-size);
		color: var(--icon-color);
		margin: var(--icon-margin);
		display: inline-block;
	}
</style>

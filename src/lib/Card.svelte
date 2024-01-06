<script lang="ts">
	export let image : string;
	export let url : string;
	export let title : string;
	export let author : string;
	export let viewed : boolean;
	export let favorite : boolean;
	export let author_id : number;
	export let isSeries = false;
	export let series = "Unknown Series";
</script>
<style>
	.alt {
  		background-color: #00ADB5;
	}
</style>

<li class="bg-mid w-48 sm:w-72 m-1" class:alt={isSeries} >
	<a href={isSeries?"/series/"+series :url}>
		<img alt="cover" class="h-72 w-72 object-cover" src={image} />
	</a>
	<div class="p-3">
		<span class="font-bold block break-words">{
			isSeries? series : title
			}</span>
		<span class="block"><a class="text-lg" href={"/author/"+author_id}>{author}</a></span>
		{#if !isSeries}
		<div class="inline-block my-3">
			<img
				alt="favorite"
				class="h-5 mx-2 inline"
				src={favorite ? "/icon-heart-on.svg" : "/icon-heart.svg"}
			/>
			<img
				alt="Viewed"
				class="h-5 mx-2 inline"
				src={viewed ? "/icon-eye-on.svg" : "/icon-eye.svg"}
			/>
		</div>
		{/if}
	</div>
</li>
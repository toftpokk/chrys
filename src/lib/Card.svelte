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
<!--height="804" width="560"-->
<li class="bg-gray-80 w-48 sm:w-72 m-1 overflow-hidden relative">
	<a href={isSeries?"/series/"+series :url} class="absolute bottom-0 top-0 left-0 right-0 z-10 box-border">
	</a>
	<div class="h-[370px] bg-gray-200 object-cover overflow-hidden">
		<img alt="cover" src={image} />
	</div>
	<!-- <img alt="cover" class="object-cover" height="804" width="560" src={image} /> -->
	<div class="p-3">
		<span class="font-bold break-words inline-block py-1 px-2 rounded-xl" class:bg-teal-100={isSeries}>{
			isSeries? series : title
			}</span>
		<span class="block"><a class="relative text-lg px-2 py-1 rounded-lg z-20 text-white hover:text-gray-20" href={"/author/"+author_id}>{author}</a></span>
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
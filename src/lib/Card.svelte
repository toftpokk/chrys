<script lang="ts">
	import Icon from "./Icon.svelte";
	import iconHeart from "$lib/icon/heart.svg?raw"
	import iconEye from "$lib/icon/eye.svg?raw"

	export let image : string;
	export let url : string;
	export let title : string;
	export let author : string;
	export let viewed : boolean;
	export let favorite : boolean;
	export let author_id : number;
	export let isSeries = false;
	export let tags : string[] = [ ]
	export let series = "Unknown Series";
</script>
<li class="bg-gray-80 w-48 sm:w-72 m-1 overflow-hidden">
	<a href={isSeries?"/series/"+series :url} class="bottom-0 top-0 left-0 right-0 z-10 box-border">
		<img alt="cover" class=" w-full h-[250px] object-cover overflow-hidden" src={image} />
	</a>
	<div class="p-3">
		<div class="font-bold break-words inline-block py-1 px-2 rounded-xl w-full" class:bg-teal-100={isSeries} class:bg-red-100={tags.includes("compilation")}>
			{#if tags.includes("japanese")}
				<img alt="JP" width="25rem" class="inline-block mx-1 mb-1" src="/flag-jp.png"/>
			{:else if tags.includes("english")}
				<img alt="EN" width="25rem" class="inline-block mx-1 mb-1" src="/flag-uk.webp"/>
			{:else if tags.includes("korean")}
				<img alt="KR" width="25rem" class="inline-block mx-1 mb-1" src="/flag-korea.png"/>
			{:else if tags.includes("chinese")}
				<img alt="CH" width="25rem" class="inline-block mx-1 mb-1" src="/flag-china.png"/>
			{/if}
			<span>{isSeries? series : title}</span>
		</div>
		<span class="block"><a class="relative text-lg px-2 py-1 rounded-lg z-20 text-white hover:text-gray-20" href={"/author/"+author_id}>{author}</a></span>
		<div class="inline-block my-3">
			{#if !isSeries}
				<Icon
					src={iconHeart}
					color={favorite?"#EEE":"#535A65"}
					margin="0 0.5rem"
				/>
				<Icon
					src={iconEye}
					color={viewed?"#EEE":"#535A65"}
					margin="0 0.5rem"
				/>
			{/if}
		</div>
	</div>
</li>
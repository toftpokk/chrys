<script lang="ts">
	import { page } from '$app/stores';
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
	import CardList from '$lib/CardList.svelte';
    const tag_name = $page.params.tag_name
    
	export let data : {work: work[]};
</script>
<main class="w-full mt-6" >
    <h1 class="text-4xl flex justify-center my-8">Tag: {tag_name}</h1>
    <CardList data={data}/>
    <Footer/>
</main>
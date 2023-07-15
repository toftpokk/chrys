<script lang="ts">
    import Card from '$lib/Card.svelte'
    import PageNav from '$lib/PageNav.svelte';
    import Footer from '$lib/Footer.svelte'
    import type { work } from '$lib/types'
	import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER } from '$env/static/public';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import CardList from '$lib/CardList.svelte';
    
	export let data : {work: work[], author_name: string};
    const author_name = data.author_name
</script>
<main class="w-full mt-6" >
    <h1 class="text-4xl flex justify-center my-8">Author: {author_name}</h1>
    <CardList data={data}/>
    <Footer/>
</main>
<script lang="ts">
	import Tag from '$lib/atom/Tag.svelte';
	import { get_tag_suggestions } from '$lib/helper';
    export let data : import("./$types").PageData
    const tag_suggestions = get_tag_suggestions();
    const misc_tags = Object.keys(data.tags).filter((tag_name)=>{
        for(let group_idx in tag_suggestions){
            if(tag_suggestions[group_idx].tags.includes(tag_name)){
                return false
            }
        }
        return true
    })
</script>

<svelte:head>
    <title>Tags - Chrys</title>
</svelte:head>
<main class="w-full" >
    <h1 class="text-4xl flex justify-center my-8">Tags</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each tag_suggestions as suggestion_group}
                <p>{suggestion_group.name}</p>
                {#each suggestion_group.tags as tag}
                    {#if data.tags[tag] > -1}
                        <a class="pill m-1" href={"/tag/"+tag+"?has-viewed=true&has-compilation=true"}>{tag} <span class="text-gray-30">{data.tags[tag]}</span></a>
                    {:else}
                        <a class="pill bg-gray-100 border-gray-100 hover:bg-gray-80 hover:border-gray-80 m-1" href={"/tag/"+tag}>{tag}</a>
                    {/if}
                {/each}
                <hr class="my-3"/>
            {/each}
            {#each misc_tags as tag}
                <a class="pill m-1" href={"/tag/"+tag+"?has-viewed=true&has-compilation=true"}>{tag} <span class="text-gray-30">{data.tags[tag]}</span></a>
            {/each}
        </div>
    </div>
</main>
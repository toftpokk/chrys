<script lang="ts">
    import Header from '$lib/Header.svelte'
	import Tag from '$lib/atom/Tag.svelte';
	import { get_tag_suggestions } from '$lib/helper';
    export let data : import("./$types").PageData
    const tag_suggestions = get_tag_suggestions();
    const misc_tags = data.tags.filter((tag_name)=>{
        for(let group_idx in tag_suggestions){
            if(tag_suggestions[group_idx].tags.includes(tag_name)){
                return false
            }
        }
        return true
    })
</script>
<main class="w-full" >
    <Header/>
    <h1 class="text-4xl flex justify-center my-8">Tags</h1>
    <div class="max-w-7xl flex-wrap justify-center mx-auto">
        <div class="block mb-4">
            {#each tag_suggestions as suggestion_group}
                <p>{suggestion_group.name}</p>
                {#each suggestion_group.tags as tag}
                    {#if data.tags.indexOf(tag) > -1}
                        <Tag href={"/tag/"+tag} size="lg">{tag}</Tag>
                    {:else}
                        <Tag href={"/tag/"+tag} variant={2} size="lg">{tag}</Tag>
                    {/if}
                {/each}
                <hr class="my-3"/>
            {/each}
            {#each misc_tags as tag}
                <Tag href={"/tag/"+tag} size="lg">{tag}</Tag>
            {/each}
        </div>
    </div>
</main>
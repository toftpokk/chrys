<script lang="ts">
	import HeaderItem from "./HeaderItem.svelte";
    import iconIndex from "$lib/icon/index.svg?raw"
    import iconAuthors from "$lib/icon/authors.svg?raw"
    import iconSearch from "$lib/icon/search.svg?raw"
    import iconTags from "$lib/icon/tags.svg?raw"
    import iconHistory from "$lib/icon/history.svg?raw"
    import iconFolder from "$lib/icon/folder.svg?raw"
    import iconSettings from "$lib/icon/settings.svg?raw"
    import iconAbout from "$lib/icon/about.svg?raw"
	import { page } from "$app/stores";
    let current_page = ""
    $: $page.url && (current_page = $page.url.pathname.split('/')[1]);
</script>
<div class="bg-main mb-5 overflow-hidden">
    <ul class="block max-w-7xl w-max mx-auto">
        <HeaderItem name="Index" url="/" icon={iconIndex} active={current_page == ""}/>
        <HeaderItem name="Authors" url="/author" icon={iconAuthors} active={current_page == "author"}/>
        <HeaderItem name="Tags" url="/tag" icon={iconTags} active={current_page == "tag"}/>
        <HeaderItem name="Search" url="/alpha" icon={iconSearch} active={current_page == "alpha"}/>
        <HeaderItem name="History" url="/history" icon={iconHistory} active={current_page == "history"}/>
        <HeaderItem name="Series" url="/series" icon={iconFolder} active={current_page == "series"}/>
        <HeaderItem name="Settings" url="/settings" icon={iconSettings} active={current_page == "settings"}/>
        <HeaderItem name="About" url="/about" icon={iconAbout} active={current_page == "about"}/>
    </ul>
</div>
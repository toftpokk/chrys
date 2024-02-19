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
    const current_page = $page.url.pathname;
</script>
<div class="bg-main mb-5 overflow-hidden">
    <ul class="block max-w-7xl w-max mx-auto">
        <HeaderItem name="Index" url="/" icon={iconIndex} currentPage={current_page}/>
        <HeaderItem name="Authors" url="/author" icon={iconAuthors} currentPage={current_page}/>
        <HeaderItem name="Tags" url="/tag" icon={iconTags} currentPage={current_page}/>
        <HeaderItem name="Search" url="/alpha" icon={iconSearch} currentPage={current_page}/>
        <HeaderItem name="History" url="/history" icon={iconHistory} currentPage={current_page}/>
        <HeaderItem name="Series" url="/series" icon={iconFolder} currentPage={current_page}/>
        <HeaderItem name="Settings" url="/settings" icon={iconSettings} currentPage={current_page}/>
        <HeaderItem name="About" url="/about" icon={iconAbout} currentPage={current_page}/>
    </ul>
</div>
<script>
	import { page } from "$app/stores";

    const links = [
        {icon:"/icons/index.svg",url:"/",name:"Index"},
        {icon:"/icons/authors.svg",url:"/author",name:"Authors"},
        {icon:"/icons/tags.svg",url:"/tag",name:"Tags"},
        {icon:"/icons/search.svg",url:"/alpha",name:"Search"},
        {icon:"/icons/history.svg",url:"/history",name:"History"},
        {icon:"/icons/folder.svg",url:"/series",name:"Series"},
        {icon:"/icons/settings.svg",url:"/settings",name:"Settings"},
        {icon:"/icons/about.svg",url:"/about",name:"About"},
    ]
    const current_page = $page.url.pathname;
</script>
<style>
    .link { 
        color: black;
        filter: invert(100%);
    }
    .link-current { 
        filter: invert(50%);
    }
</style>
<div class="bg-main mb-5 overflow-hidden">
    <ul class="block max-w-7xl w-max mx-auto">
        {#each links as link}
            <li class="m-4 inline-block link" class:link-current={current_page == link.url}>
                <a class="text-lg inline" href={link.url}>
                    <img class="w-4 mb-1 icon inline" src={link.icon} alt={link.name}>
                    <span class="text-md hidden sm:inline">{link.name}</span>
                </a>
            </li>
        {/each}
    </ul>
</div>
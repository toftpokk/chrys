<script>
    const links = [
        {icon:"/icons/index.svg",url:"/",name:"Index"},
        {icon:"/icons/authors.svg",url:"/author",name:"Authors"},
        {icon:"/icons/tags.svg",url:"/tag",name:"Tags"},
        {icon:"/icons/alphabet.svg",url:"/alphabet",name:"Alphabet"},
        {icon:"/icons/history.svg",url:"/history",name:"History"},
        {icon:"/icons/export.svg",url:"/export",name:"Export"},
        {icon:"/icons/about.svg",url:"/about",name:"About"},
    ]
</script>
<style>
    .icon { 
        filter: invert(100%);
    }
    .icon:hover { 
        filter: invert(50%);
    }
</style>
<div class="bg-main overflow-scroll">
    <ul class="block max-w-7xl w-max mx-auto">
        {#each links as link}
            <li class="m-4 inline-block">
                <a class="text-xl inline" href={link.url}>
                    <img class="w-5 icon inline" src={link.icon} alt={link.name}>
                    <span class="text-md">{link.name}</span>
                </a>
            </li>
        {/each}
    
    </ul>
</div>
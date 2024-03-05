import { sort_type } from "$lib/consts.js";
import { get_page } from "$lib/helper.js"
import { list_works } from "$lib/server/db";

export async function load({url}){
    let page = get_page(url.searchParams)
    let sort = url.searchParams.get("sort")
    let has_viewed = url.searchParams.get("has-viewed")==="true" ? true : false;
    let has_compilation = url.searchParams.get("has-compilation")==="true" ? true : false;

    if(!sort){
        sort = sort_type[0]
    }
    let data = await list_works({page,sort,has_viewed,needs_active:true,has_compilation})
    return {
        work: data.work,
        num_pages: data.num_pages
    }
}
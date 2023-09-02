import { sort_type } from "$lib/consts.js";
import { get_page } from "$lib/helper.js"
import { list_works } from "$lib/server/db";

export function load({url}){
    let page = get_page(url.searchParams)
    let sort = url.searchParams.get("sort")
    let has_viewed = url.searchParams.get("has-viewed")==="false" ? false : true;

    if(!sort){
        sort = sort_type[0]
    }
    return {
        work: list_works({page,sort,has_viewed})
    }
}
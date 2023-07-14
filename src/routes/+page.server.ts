import { sort_type } from "$lib/consts.js";
import { list_work } from "$lib/server/db";
import { get_page } from "$lib/helper.js"

export function load({url}){
    let page = get_page(url.searchParams)
    let sort = url.searchParams.get("sort")

    if(!sort){
        sort = sort_type[0]
    }
    return {
        work: list_work(page,sort)
    }
}
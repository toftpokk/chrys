import { sort_type } from "$lib/consts.js";
import { list_work } from "$lib/server/db";

export function load({url}){
    let page = Number(url.searchParams.get("page"))
    let sort = url.searchParams.get("sort")
    if(page == 0){
        page = 1
    }
    if(!sort){
        sort = sort_type[0]
    }
    return {
        page,
        search_params: url.searchParams.toString(),
        work: list_work(page,sort)
    }
}
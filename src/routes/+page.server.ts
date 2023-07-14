import { sort_type } from "$lib/consts.js";
import { list_work } from "$lib/server/db";

const get_page = (searchParams: URLSearchParams)=>{
    const page_str = searchParams.get("page")
    return page_str ? Number(page_str) : 1
}

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
import { list_work } from "../lib/server/db";

export function load({url}){
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    return {
        page: page,
        work: list_work(page)
    }
}
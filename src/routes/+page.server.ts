import { list_work } from "../lib/server/db";

export function load({url}){
    const page = Number(url.searchParams.get("page"))
    return {
        page: page,
        work: list_work(page)
    }
}
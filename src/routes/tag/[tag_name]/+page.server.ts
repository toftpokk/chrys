import { get_author, list_work_by_author } from '$lib/server/db/index.js'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const work = await list_work_by_author(1,page)
    // TODO fix to list_work_by_tag

    return {
        work,
        page
    }
}
import { list_work_by_tag } from '$lib/server/db/index.js'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const work = await list_work_by_tag(params.tag_name,page)

    return {
        work,
    }
}
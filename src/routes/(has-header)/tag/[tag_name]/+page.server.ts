import { list_work_with_tags } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const data = await list_work_with_tags(params.tag_name,page)

    return {
        num_pages: data.num_pages,
        work: await data.works,
    }
}
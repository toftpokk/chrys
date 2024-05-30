import { list_work_with_alpha } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const data = list_work_with_alpha(params.alpha,page)

    return {
        work: await data.work,
        num_pages: data.num_pages
    }
}
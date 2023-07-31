import { list_work_with_alpha } from '$lib/server/db'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const work = await list_work_with_alpha(params.alpha)

    return {
        work,
    }
}
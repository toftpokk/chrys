import { list_work_with_series } from '$lib/server/db'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const series = params.name
    const work = await list_work_with_series(series,page)

    return {
        work,
    }
}
import { list_work_with_series } from '$lib/server/db'

export const load = ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const series = params.name
    return list_work_with_series(series,page)
}
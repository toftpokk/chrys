import { sort_type } from '$lib/consts'
import { list_works } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    let sort = url.searchParams.get("sort")
    let has_viewed = url.searchParams.get("has-viewed")==="true" ? true : false;
    let has_compilation = url.searchParams.get("has-compilation")==="true" ? true : false;

    if(page == 0){
        page = 1
    }
    if(!sort){
        sort = "id"
    }
    const data = await list_works({
        page,sort,has_viewed,needs_active:true,has_compilation,
        with_tag: params.tag_name
    })
    
    return {
        num_pages: data.num_pages,
        work: await data.work,
    }
}
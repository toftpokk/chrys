import { get_author, list_works } from '$lib/server/db'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const author_id = Number(params.author_id)
    const work = await list_works(page, "default", author_id)
    const author = await get_author(author_id)
    const author_name = author? author.name : "Unnamed Author"

    return {
        author_name,
        work,
    }
}
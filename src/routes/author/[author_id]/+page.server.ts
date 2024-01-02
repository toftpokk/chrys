import { get_author, list_works } from '$lib/server/db'

export const load = async ({params,url})=>{
    let page = Number(url.searchParams.get("page"))
    if(page == 0){
        page = 1
    }
    const author_id = Number(params.author_id)
    const data = await list_works({page,author_id: author_id,needs_active:true,sort:"name"})
    const author = await get_author(author_id)
    const author_name = author? author.name : "Unnamed Author"
    const author_fav = author? author.favorite : 0

    return {
        author_name,
        work: data.work,
        num_pages: data.num_pages,
        favorite: author_fav
    }
}
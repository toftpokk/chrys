import { list_author } from '$lib/server/db/index.js'

export const load = async ({params})=>{
    const authors = list_author()
    return {authors}
}
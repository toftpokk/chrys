import { list_authors } from '$lib/server/db'

export const load = async ({params})=>{
    const authors = await list_authors()
    return {
        authors: authors
    }
}
import { list_authors } from '$lib/server/db'

export const load = async ({params})=>{
    const authors = list_authors()
    return {authors}
}
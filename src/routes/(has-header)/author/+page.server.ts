import { list_authors } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ()=>{
    const authors = await list_authors()
    return {
        authors: authors
    }
}
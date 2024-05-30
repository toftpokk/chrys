import { list_tags } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ()=>{
    const tags = list_tags()
    return {tags}
}
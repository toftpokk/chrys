import { list_tags } from '$lib/server/db'

export const load = async ({params})=>{
    const tags = list_tags().sort()
    return {tags}
}
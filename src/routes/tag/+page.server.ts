import { get_tag } from '$lib/server/db/index.js'

export const load = async ({params})=>{
    const tags = get_tag()
    return {tags}
}
import { list_alpha } from '$lib/server/db'

export const load = async ({params})=>{
    const alpha = list_alpha()
    return {alpha}
}
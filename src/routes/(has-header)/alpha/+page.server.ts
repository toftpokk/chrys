import { list_alpha } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ()=>{
    const alpha = list_alpha()
    return {alpha}
}
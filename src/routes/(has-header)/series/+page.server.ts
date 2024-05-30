import { list_series } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ()=>{
    const series = await list_series()
    return {
        series
    }
}
import { get_work, list_series, list_tags } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load : PageServerLoad = async ({params})=>{
    const work_id = Number(params.work_id)
    const work = await get_work(work_id)
    const all_work_tags = list_tags()
    const series = await list_series()
    return {
        all_work_tags,
        work,
        series
    }
}
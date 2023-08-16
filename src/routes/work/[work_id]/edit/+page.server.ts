import { get_work, list_tags } from '$lib/server/db'

export const load = async ({params})=>{
    const work_id = Number(params.work_id)
    const work = await get_work(work_id)
    const all_work_tags = list_tags()
    return {
        all_work_tags,
        work
    }
}
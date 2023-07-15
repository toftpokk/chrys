import { get_work } from '$lib/server/db/index.js'

export const load = async ({params})=>{
    const work_id = Number(params.work_id)
    const work = await get_work(work_id)
    return {
        work
    }
}
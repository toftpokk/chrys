import { get_work } from '$lib/server/db/index.js'

export const load = async ({params})=>{
    const work = await get_work(Number(params.work_id))

    return {
        work
    }
}
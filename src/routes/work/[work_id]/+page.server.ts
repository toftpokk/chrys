import { get_work } from '$lib/server/db/index.js'

export async function load ({params}){
    const work = await get_work(Number(params.work_id))

    return {
        work
    }
}
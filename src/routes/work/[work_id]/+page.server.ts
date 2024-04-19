import { get_work,get_similar } from '$lib/server/db'

export const load = async ({params})=>{
    const work_id = Number(params.work_id)
    const work = await get_work(work_id)
    let similar : any[] = []
    if(work){
        similar = await get_similar(work_id, work.tags)
    }
    return {
        work,
        similar
    }
}
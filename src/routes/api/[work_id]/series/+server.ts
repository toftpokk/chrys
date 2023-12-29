import { setSeries } from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const POST = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const series = await request.json()
    await setSeries(work_id,series)
    return json({},{status: 201})
}
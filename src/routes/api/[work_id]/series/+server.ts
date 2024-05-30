import { setSeries } from '$lib/server/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const series = await request.json()
    await setSeries(work_id,series)
    return json({},{status: 201})
}
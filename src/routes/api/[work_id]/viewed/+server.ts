import { json } from '@sveltejs/kit'
import { setView } from '$lib/server/db'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const {state} = await request.json()
    await setView(work_id,state)
    return json({state})
}
import { json } from '@sveltejs/kit'
import { setFav } from '$lib/server/db'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const {state} = await request.json()
    await setFav(work_id,state)
    return json({state})
}
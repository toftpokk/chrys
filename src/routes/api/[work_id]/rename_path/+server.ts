import { setPath } from '$lib/server/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST : RequestHandler= async ({request,params})=>{
    const work_id = Number(params.work_id)
    const path = await request.json()
    await setPath(work_id,path)
    return json({},{status: 201})
}
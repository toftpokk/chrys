import { setName } from '$lib/server/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const name = await request.json()
    await setName(work_id,name)
    return json({},{status: 201})
}
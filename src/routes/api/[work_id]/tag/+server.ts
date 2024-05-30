import { setTag } from '$lib/server/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const tags = await request.json()
    await setTag(work_id,tags.join(" "))
    return json({},{status: 201})
}
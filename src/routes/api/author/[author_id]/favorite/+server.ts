import { json } from '@sveltejs/kit'
import { setAuthorFav } from '$lib/server/db'
import type { RequestHandler } from './$types'

export const POST : RequestHandler = async ({request,params})=>{
    const work_id = Number(params.author_id)
    const {state} = await request.json()
    await setAuthorFav(work_id,state)
    return json({state})
}
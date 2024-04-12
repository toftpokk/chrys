import { setPath } from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const POST = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const path = await request.json()
    await setPath(work_id,path)
    return json({},{status: 201})
}
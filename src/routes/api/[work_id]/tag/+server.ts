import { setTag } from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const POST = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const tags = await request.json()
    await setTag(work_id,tags.join(" "))
    return json({})
}
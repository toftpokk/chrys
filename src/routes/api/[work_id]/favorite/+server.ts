import { json } from '@sveltejs/kit'
import { setFav } from '$lib/server/db/index.js'

export const POST = async ({request,params})=>{
    const work_id = Number(params.work_id)
    const {state} = await request.json()
    await setFav(work_id,state)
    return json({state})
}
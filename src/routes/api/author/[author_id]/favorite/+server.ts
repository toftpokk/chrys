import { json } from '@sveltejs/kit'
import { setAuthorFav } from '$lib/server/db'

export const POST = async ({request,params})=>{
    const work_id = Number(params.author_id)
    const {state} = await request.json()
    await setAuthorFav(work_id,state)
    return json({state})
}
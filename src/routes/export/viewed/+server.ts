import { list_works } from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const GET = async ({request,params})=>{
    const work = await list_works({needs_active: false})
    const viewed_work = work.filter((w)=>(w.viewed))
    return json(viewed_work)
}
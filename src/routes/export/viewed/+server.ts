import { list_works } from '$lib/server/db'
import { json } from '@sveltejs/kit'

export const GET = async ({request,params})=>{
    const work = await list_works(null,"default",null,false)
    const viewed_work = work.filter((w)=>(w.viewed))
    return json(viewed_work)
}
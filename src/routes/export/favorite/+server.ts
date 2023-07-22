import { list_all_work } from '$lib/server/db/index.js'
import { json } from '@sveltejs/kit'

export const GET = async ({request,params})=>{
    const work = await list_all_work()
    const viewed_work = work.filter((w)=>(w.favorite == 1))
    return json(viewed_work)
}
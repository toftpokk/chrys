import { list_works } from '$lib/server/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types';

export const GET : RequestHandler = async ()=>{
    const data = await list_works({needs_active: false});
    const viewed_work = data.work.filter((w)=>(w.favorite))
    return json(viewed_work)
}
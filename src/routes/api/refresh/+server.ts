import { json } from '@sveltejs/kit'
import { init_table } from '$lib/server/db/database'

export const GET = async ()=>{
    init_table()
    return json({})
}
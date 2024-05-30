import { json } from '@sveltejs/kit'
import { init_table } from '$lib/server/db/database'
import type { RequestHandler } from './$types'

export const GET : RequestHandler = async ()=>{
    await init_table()
    return json({})
}
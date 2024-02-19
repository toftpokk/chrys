import { list_series } from '$lib/server/db'

export const load = async ({params})=>{
    const series = await list_series()
    return {
        series
    }
}
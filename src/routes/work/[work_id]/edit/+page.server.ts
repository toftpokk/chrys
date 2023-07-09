import { get_work, setTag } from '$lib/server/db/index.js'

export const load = async ({params})=>{
    const work_id = Number(params.work_id)
    const work = await get_work(work_id)
    return {
        work
    }
}

export const actions = {
    update_tag: async ({params, request})=>{
        const work_id = Number(params.work_id)
        const data = await request.formData()
        const tag_string = await data.get("tags")
        if(typeof tag_string === "string"){
            setTag(work_id,tag_string)
        }
        else{
            setTag(work_id,"")
        }
    }
}
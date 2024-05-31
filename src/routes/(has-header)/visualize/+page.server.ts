import { get_similar_batch, list_works } from "$lib/server/db";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = () => {
    const gengraph = async ()=>{
        const works = (await list_works({})).work
        const included : Record<string,boolean> = {}
        const graph : {
            nodes: {name: string, id: number, tags: string[]}[],
            links: {source: number, target: number}[],
        } = {
            nodes: [],
            links: []
        }
        const jaccards = await get_similar_batch()
        jaccards.forEach((j)=>{
            if(j.tags.length < 1) return
            if(j.similar.length < 1) return

            const most_similar = j.similar[0]
            if(!included[j.work_id]){
                included[j.work_id] = true
                graph.nodes.push({
                    name: j.name,
                    id: j.work_id,
                    tags: j.tags
                })
            }
            if(!included[most_similar.work.work_id]){
                included[most_similar.work.work_id] = true
                graph.nodes.push({
                    name: most_similar.work.name,
                    id: most_similar.work.work_id,
                    tags: most_similar.work.tags
                })
            }
            graph.links.push({
                target: most_similar.work.work_id,
                source: j.work_id
            })
        })
        return graph
    }
    return {
        graph: gengraph()
    }
};
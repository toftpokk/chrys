import { get_similar, list_works } from "$lib/server/db";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = () => {
    const make_links = async ()=>{
        const works = (await list_works({})).work
        const included : Record<string,boolean> = {}
        const graph : {
            nodes: {name: string, id: number, tags: string[]}[],
            links: {source: number, target: number}[],
        } = {
            nodes: [],
            links: []
        }
        for(let i=0;i<works.length;i++){
            const work = works[i]
            if(work.tags.length < 1){
                continue
            }
            let sims = await get_similar(work.work_id,work.tags)

            if(sims.length < 1){
                continue
            }
            let most_similar = sims[0]

            if(!included[work.work_id]){
                included[work.work_id] = true
                graph.nodes.push({
                    name: work.name,
                    id: work.work_id,
                    tags: work.tags
                })
            }
            
            if(!included[most_similar.work_id]){
                included[most_similar.work_id] = true
                graph.nodes.push({
                    name: most_similar.name,
                    id: most_similar.work_id,
                    tags: most_similar.tags
                })
            }
            const x = {
                target: work.work_id,
                source: most_similar.work_id,
                tags: most_similar.tags
            }
            graph.links.push(x)
        }
        return graph
    }
    return {
        graph: make_links()
    }
};
import { get_similar_batch, list_works } from "$lib/server/db";
import { gray, link } from "d3";
import type { PageServerLoad } from "./$types";

type Graph = {
    nodes: {name: string, id: number, tags: string[]}[],
    links: {source: number, target: number}[],
}

const intersect = function (a : any[], b : any[]) {
    let x : any[] = [];
    function pushx(e : any){
        // found e in a
        if (!!~a.indexOf(e)) x.push(e);
    }
    b.forEach(v=>pushx(v))
    return x
}

export const load: PageServerLoad = async () => {
    const gengraph = async ()=>{
        const included : Record<string,boolean> = {}
        const graph : Graph = {
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
    const cluster = (g: Graph)=>{
        const nodes = g.nodes
        const links = g.links

        const cluster : Map<number, number>= new Map()
        const seen : Map<number, boolean> = new Map()
        const clusterdata : Map<number, {
            tags: string[]
            count: number
            sample: number
        }>= new Map()

        const dfs = (id: number, clid: number)=>{
            let dfsc = 0
            const s : number[] = []
            s.push(id)
            dfsc +=1
            while(s.length > 0){
                const v = s.pop()
                if(typeof v === "undefined") continue
                if(typeof seen.get(v) !== "undefined") continue
                seen.set(v,true)
                cluster.set(v, clid)
                // common tags
                const currentcluster = clusterdata.get(clid)
                const currentnode = nodes.filter((n)=>n.id === v)[0]
                if(typeof currentcluster === "undefined"){
                    clusterdata.set(clid, {
                        tags: currentnode.tags,
                        count: 1,
                        sample: v
                    })
                }
                else{
                    clusterdata.set(clid, {
                        tags: intersect(currentcluster.tags, currentnode.tags),
                        count: currentcluster.count+1,
                        sample: v 
                    })
                }
                links.forEach((link)=>{
                    if(link.source === v){
                        dfsc +=1
                        s.push(link.target)
                    }
                    if(link.target === v){
                        dfsc +=1
                        s.push(link.source)
                    }
                })
            }
        }

        let clid = 0

        nodes.forEach((n)=>{
            if(typeof seen.get(n.id) !== "undefined"){
                return
            }
            dfs(n.id, clid)
            clid+=1
        })
        
        const sorted_clusters = Array.from(clusterdata).map((v)=>(v[1])).sort((a,b)=>b.count-a.count)
        // result: similar work clusters' tags, sorted by number of work in each cluster
        return sorted_clusters
    }
    const graph = await gengraph()
    
    return {
        graph
    }
};
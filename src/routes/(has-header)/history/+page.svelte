<script lang="ts">
	import type { db_history } from '$lib/types';
    
	export let data : import("./$types").PageData

    const history = data.history.map(
        (histitem)=>({...histitem, datestring: new Date(histitem.datetime).toLocaleDateString('en-UK')}))
    function diffDays(d1: Date, d2: Date){
        return Math.ceil((d2.valueOf()-d1.valueOf()) / (1000 * 60 * 60 * 24));
    }

    function getDataArray(bucket_days: number, startDate: Date|null): {data: Record<number,number>, domain: number, range: number}{
        let domain = 0
        let range = 0
        let min_domain_date : Date | null = null
        let max_domain_date : Date | null = null
        const data: Record<number,number> = {}

        history.forEach(h=>{
            const dt = new Date(h.datetime)
            if(!min_domain_date || dt < min_domain_date){
                min_domain_date = dt
            }
            if(!max_domain_date || dt > max_domain_date){
                max_domain_date = dt
            }
        })
        
        if(min_domain_date == null){
            return {data:{},domain:0,range:0}
        }
        if(startDate){
            if(diffDays(startDate, min_domain_date)<0){
                min_domain_date = startDate
            }
        }
        domain = Math.floor(diffDays(min_domain_date, max_domain_date as any)/bucket_days)
        history.forEach(h=>{
            const cur_date = new Date(h.datetime)
            const idx = diffDays(min_domain_date as Date,cur_date)
            const dateIndex = domain-Math.floor(idx/bucket_days)
            if(domain-dateIndex < 0){
                return
            }
            if(dateIndex in data){
                data[dateIndex] += 1
            }
            else{
                data[dateIndex] = 1
            }
            if(range < data[dateIndex]){
                range = data[dateIndex]
            }
        })
        return {
            data, domain, range
        }
    }
    const aggregate = 1
    const graphData = getDataArray(aggregate,new Date("2023-11-15"))
    const graphMeta = {
        height: 15,
        width: (graphData.domain+1)*2.1,
        bar_width: 2,
        bar_gap: 0.1,
        backline_count: graphData.range/2
    }
</script>

<svelte:head>
    <title>History - Chrys</title>
</svelte:head>
<main>
    <svg class="border rounded-lg" width="100%" height="5em" viewBox={`0 0 ${graphMeta.width} ${graphMeta.height}`}>
        {#each {length:graphMeta.backline_count+1} as _,idx}
            <line
            class="stroke-gray-50"
            x1="0" 
            y1={(idx/graphMeta.backline_count)*graphMeta.height} 
            x2={(graphData.domain+1)*2.1}
            y2={(idx/graphMeta.backline_count)*graphMeta.height} 
            stroke-width="0.1"/>
        {/each}
        {#each Object.keys(graphData.data) as d}
            <rect 
                class="fill-red-100" 
                x={(graphMeta.bar_width+graphMeta.bar_gap)*Number(d)} 
                y={((graphData.range-graphData.data[Number(d)])*graphMeta.height)/graphData.range} 
                width={graphMeta.bar_width} 
                height={(graphData.data[Number(d)]/graphData.range)*graphMeta.height}/>
        {/each}
    </svg>
    <div class="overflow-scroll max-w-[60em] mx-auto border rounded-xl">
    <table class="w-max table-auto border-gray-20 mx-auto">
        <thead class="font-bold border-b border-gray-20">
            <tr class="">
                <td class="w-10"></td>
                <td class="w-24 py-2">Date</td>
                <td>Name</td>
            </tr>
        </thead>
        <tbody class="w-full">
        {#each history as histitem}
            <tr class="h-[2.5em] hover:bg-gray-80 border-b border-gray-50">
                <td class="text-center">
                {#if histitem.viewed}
                    <span class="w-[1.6em] mx-auto block border border-teal-100 text-teal-100 rounded-full">
                        &#10004;
                    </span>
                {:else}
                    <span class="w-[1.6em] mx-auto border block border-red-100 text-red-100 rounded-full">
                        &#10005;
                    </span>
                {/if}
                </td>
                <td class="">{histitem.datestring}</td>
                <td>

                    {#if histitem.viewed}
                        <a class="underline hover:text-gray-20" href={"/work/"+histitem.work_id} >{histitem.name}</a>
                    {:else}
                        <a class="text-red-100 underline hover:text-gray-20" href={"/work/"+histitem.work_id} >{histitem.name}</a>
                    {/if}
                    
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
    </div>
</main>
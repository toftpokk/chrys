<script lang="ts">
    import Header from '$lib/Header.svelte'
	import type { db_history } from '$lib/types';
    
	export let data : {history:db_history[]};

    const history = data.history.map(
        (histitem)=>({...histitem, datestring: new Date(histitem.datetime).toLocaleDateString('en-UK')}))
</script>
<main>
    <Header/>
    <div class="md:w-full overflow-scroll md:max-w-7xl mx-auto ">
    <table class="table-auto w-[600px] md:w-11/12 mx-auto">
        <thead class="font-bold text-xl">
            <tr>
                <td></td>
                <td class="w-32">Date</td>
                <td>Name</td>
            </tr>
        </thead>
        <tbody class="text-xl">
        {#each history as histitem}
            <tr>
                <td 
                class:bg-green-500={histitem.viewed} 
                class:bg-red-500={histitem.viewed?false:true}
                class="text-center">{histitem.viewed?"O":" "}
                </td>
                <td>{histitem.datestring}</td>
                <td>
                    <a class="underline hover:text-gray-400" href={"/work/"+histitem.work_id}>{histitem.name}</a>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
    </div>
</main>
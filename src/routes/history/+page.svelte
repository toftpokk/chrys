<script lang="ts">
    import Header from '$lib/Header.svelte'
	import type { db_history } from '$lib/types';
    
	export let data : import("./$types").PageData

    const history = data.history.map(
        (histitem)=>({...histitem, datestring: new Date(histitem.datetime).toLocaleDateString('en-UK')}))
</script>
<main>
    <Header/>
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
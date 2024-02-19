import { select_histories } from '$lib/server/db/database.js';


export function load({url}){
    const history = select_histories().sort((a,b)=>{
        return a.datetime < b.datetime ? 1 : -1
    })
    return {history}
}
import { select_histories } from '$lib/server/db/database.js';


export function load({url}){
    const history = select_histories()
    return {history}
}
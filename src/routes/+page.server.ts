import { list_work } from "../lib/server/db";

export function load(){
    return {
        work: list_work()
    }
}
import type { work } from "$lib/types"

export const sort_name = (a: {name:string}, b: {name:string})=>{
    const a_name = a.name.toUpperCase()
    const b_name = b.name.toUpperCase()
    if(a_name == b_name){
        return 0
    }
    if(a_name > b_name){
        return 1
    }
    return -1
}

export const sort_fav = (a: {favorite:boolean}, b: {favorite:boolean})=>{
    const a_fav = a.favorite
    const b_fav = b.favorite
    if(a_fav == b_fav){
        return 0
    }
    if(a_fav < b_fav){
        return 1
    }
    return -1
}

export const sort_view = (a: {viewed:boolean}, b: {viewed:boolean})=>{
    const a_view = a.viewed
    const b_view = b.viewed
    if(a_view == b_view){
        return 0
    }
    if(a_view < b_view){
        return 1
    }
    return -1
}

export const sort_author = (a: {author_id:number}, b:{author_id:number})=>{
    const a_author = a.author_id
    const b_author = b.author_id
    if(a_author == b_author){
        return 0
    }
    if(a_author > b_author){
        return 1
    }
    return -1
}

export const random_shuffle = (array : any[], seed: number):any[]=>{
    let m = array.length;
    let t, i;
    while(m){
        i = Math.floor(random(seed)*m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed
    }
    return array
}

const random = (seed:number):number =>{
    let x = Math.sin(seed++)*10000;
    return x - Math.floor(x);
}
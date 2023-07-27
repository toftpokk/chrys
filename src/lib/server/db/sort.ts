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

export const sort_random = (a:any,b:any)=>{
    return 0.5-Math.random()
}
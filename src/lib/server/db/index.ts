
import type { author, db_work, work } from '$lib/types'
import { page_size } from '$lib/consts'
import { select_author_with_id, select_authors, select_work_author_with_id, select_work_authors, select_work_authors_with_id, select_works, update_favorite, update_tag, update_view, update_author_favorite, fuse, update_series } from './database'
import { random_shuffle, sort_author, sort_fav, sort_name, sort_view } from './sort'
import { tag_deserialize } from '$lib/helper'
import { PUBLIC_IMAGE_REPO, PUBLIC_IMAGE_SERVER, PUBLIC_RANDOM_SEED } from '$env/static/public'

const paginate = (page: number)=>{
    const start = (page-1)*page_size
    const end = page*page_size
    return {start,end}
}

// // DATABASE OPERATIONS

// set

export const setAuthorFav = async (author_id: number, state: boolean)=>{
    return update_author_favorite(author_id, state)
}

export const setFav = async (work_id: number, state: boolean)=>{
    return update_favorite(work_id, state)
}

export const setView = async (work_id: number, state: boolean)=>{
    return update_view(work_id, state)
}

export const setTag = async (work_id: number, tag_string: string)=>{
    update_tag(work_id, tag_string)
}

export const setSeries = async (work_id: number, series: string)=>{
    update_series(work_id, series)
}

// // GET

// Images

const get_images = async (author_name:string,work_name:string) : Promise<string[]>=>{
    const author_comp = encodeURIComponent(author_name)
    const work_comp = encodeURIComponent(work_name)
    let images = []
    try{
        const res = await fetch(`${PUBLIC_IMAGE_SERVER}/api/repo/${PUBLIC_IMAGE_REPO}/${author_comp}/${work_comp}`)
        if(!res.ok){
            throw new Error("Response not OK")
        }
        else{
            const data = await res.json()
            images = data["items"]
        }
    }
    catch(error){
        console.log(`Error: Could not get images of ${work_name} by ${author_name} from image server`)
    }
    return images
}

// Single

export const get_author = async (author_id:number) : Promise<author|null>=> {
    const author = select_author_with_id(author_id)
    if(typeof author === "object"){
        return author
    }
    return null
}

export const get_work = async (work_id: number) : Promise<work|null> =>{
    const work = select_work_author_with_id(work_id)
    if(typeof work === "object"){
        const images = await get_images(work.author_name,work.name)
        return {
            ...work,
            images,
            tags: tag_deserialize(work.tags)
        }
    }
    return null
}

// TODO: use list_work
export const list_work_with_series = async (series_name: string, page: number)=>{
    const partial_works = select_work_authors()
    const tagged_works = partial_works.filter((w: any)=>{
        if(w.series == series_name){
            return true
        }
        else{
            return false
        }
    })

    const {start,end} = paginate(page)
    const works = tagged_works.slice(start,end)

    return Promise.all(works.map(async (w: db_work & {author_name: string})=>{
        const images = await get_images(w.author_name,w.name)
        return {
            ...w,
            images,
            tags: tag_deserialize(w.tags)
        }
    }))
}
// Lists

export const list_alpha = () =>{
    const works = select_works()
    const alphabets : string[] = []
    
    works.forEach((w)=>{
        const char = w.name[0].toUpperCase()
        if(!alphabets.includes(char)){
            alphabets.push(char)
        }
    })
    alphabets.sort()
    return alphabets
}

export const list_work_with_alpha = (alpha : string, page: number)=>{
    const fs = fuse?.search(alpha).map((fuseitem)=>{
        return fuseitem.item
    });
    const alpha_works = fs ? fs : [];
    const {start,end} = paginate(page)
    const num_pages = Math.ceil(alpha_works.length/page_size);
    
    const work_list = alpha_works.slice(start,end)
    const work = Promise.all(work_list.map(async (w: db_work & {author_name: string})=>{
        const images = await get_images(w.author_name,w.name)
        return {
            ...w,
            images,
            tags: tag_deserialize(w.tags)
        }
    }))
    return {
        work,
        num_pages: num_pages
    }
}

export const list_tags = () : string[]=>{
    const works = select_works()
    const all_tags : string[] = []
    works.forEach((w : any)=>{
        const tags = tag_deserialize(w.tags)
        tags.forEach((t : string)=>{
            if(!(all_tags.includes(t))){
                all_tags.push(t)
            }
        })
    })
    return all_tags
}

export const list_series = () : string[]=>{
    const works = select_works()
    const all_series : string[] = []
    works.forEach((w : any)=>{
        if(!(all_series.includes(w.series))){
            all_series.push(w.series)
        }
    })
    return all_series
}

export const list_authors = async ()=>{
    const work_authors = select_work_authors()
    const authors = select_authors()
    const author_num = authors.map((a)=>{
        return {
            ...a,
            work_count: work_authors.filter((w)=>w.author_id == a.author_id).length
        }
    })
    return author_num
}

// TODO: use list_work
export const list_work_with_tags = async (tag_name: string, page: number)=>{
    const partial_works = select_work_authors()
    const tagged_works = partial_works.filter((w: any)=>{
        if(w.tags == ''){
            return false
        }
        else{
            const tags = tag_deserialize(w.tags)
            if(tags.includes(tag_name)){
                return true
            }
            else{
                return false
            }
        }
    })

    const {start,end} = paginate(page)
    const works = tagged_works.slice(start,end)

    return Promise.all(works.map(async (w: db_work & {author_name: string})=>{
        const images = await get_images(w.author_name,w.name)
        return {
            ...w,
            images,
            tags: tag_deserialize(w.tags)
        }
    }))
}

// TODO: fix optional, mandatory inputs
export const list_works = async (options: {
            page?: number, 
            sort?: string, 
            author_id?: number, 
            needs_active?: boolean, 
            has_viewed?: boolean
        }) : Promise<{work:work[],num_pages:number}>=>{

    let needs_active = options.needs_active || false;
    let partial_works

    // Filter Author
    if(typeof options.author_id === "number"){
        partial_works = select_work_authors_with_id(
            options.author_id,
            needs_active)
    }
    else{
        partial_works = select_work_authors()
    }

    // Sorting
    if(options.sort === "name"){
        partial_works.sort(sort_name)
    }
    else if(options.sort === "favorite"){
        partial_works.sort(sort_fav)
    }
    else if(options.sort === "viewed"){
        partial_works.sort(sort_view)
    }
    else if(options.sort === "author"){
        partial_works.sort(sort_author)
    }
    else if(options.sort === "random"){
        let seed = PUBLIC_RANDOM_SEED === undefined? 0 : Number(PUBLIC_RANDOM_SEED)
        random_shuffle(partial_works, seed)
    }
    else if(options.sort === "id"){
        partial_works.reverse()
    }

    // Filter out Viewed
    if(options.has_viewed === false){
        partial_works = partial_works.filter((w)=>(!w.viewed))
    }

    // Paging 
    let works : typeof partial_works = []
    let num_pages = -1;
    if(typeof options.page === "number"){
        const {start,end} = paginate(options.page)
        works = partial_works.slice(start,end)
        num_pages = Math.ceil(partial_works.length/page_size)
    }
    else{
        works = partial_works
    }

    // Images
    const result = await Promise.all(works.map(async (w: db_work & {author_name: string})=>{
        const images = await get_images(w.author_name,w.name)
        return {
            ...w,
            images,
            tags: tag_deserialize(w.tags)
        }
    }))
    return {
        num_pages,
        work: result
    }
}

// -------------------------------

// const db_author_by_id = (author_id: number): author | undefined => {
//     const a : any = db.prepare('SELECT * FROM author WHERE author_id = ?')
//                            .get([author_id])
//     return a
// }

// const db_work_author_by_id = (work_id:number) : any | undefined =>{
//     const w : any = db.prepare(`
//     SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
//     FROM work w
//     LEFT JOIN author a
//     ON w.author_id = a.author_id
//     WHERE w.work_id = ?
//     `).get([work_id])
//     return w
// }

// const db_work_author_by_author = (author_id:number) : any | undefined =>{
//     const w : any = db.prepare(`
//     SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
//     FROM work w
//     LEFT JOIN author a
//     ON w.author_id = a.author_id
//     WHERE w.author_id = ?
//     `).all([author_id])
//     return w
// }

// const db_author = () : author[]=>{
//     const a : any[] = db.prepare(`
//     SELECT *
//     FROM author
//     `).all([])
//     return a
// }

// export const get_tag = ()=>{
//     const work : any = db_work_author()
//     const has_tags = work.filter((w:any)=>w.tags != "")
//     const all_tags : string[] = []
//     has_tags.forEach((w : any)=>{
//         const tags = tag_deserialize(w.tags)
//         tags.forEach((t : string)=>{
//             if(!(all_tags.includes(t))){
//                 all_tags.push(t)
//             }
//         })
//     })
//     return all_tags
// }

// export const get_author = async (author_id:number) : Promise<author|null>=> {
//     const author = db_author_by_id(author_id)
//     if(typeof author === "object"){
//         return author
//     }
//     return null
// }

// export const get_work = async (work_id: number) : Promise<work|null> =>{
//     const work = db_work_author_by_id(work_id)
//     if(typeof work === "object"){
//         work.images = await get_images(work.author_name,work.name)
//         work.tags = tag_deserialize(work.tags)
//         return work
//     }
//     return null
// }

// // Sorting

// export const list_author = async () : Promise<author[]>=>{
//     return db_author()
// }

// export const list_all_work = async () : Promise<any[]>=>{
//     // Note: incomplete work object
//     const works = db_work_author()
//     return works
// }

// export const list_work_by_tag = async (tag_name: string, page: number) : Promise<work[]>=>{
//     const partial_works : any = db_work_author()
//     const tagged_works = partial_works.filter((w: any)=>{
//         if(w.tags == ''){
//             return false
//         }
//         else{
//             const tags = tag_deserialize(w.tags)
//             if(tags.includes(tag_name)){
//                 return true
//             }
//             else{
//                 return false
//             }
//         }
//     })
//     const {start,end} = paginate(page)
//     const works = tagged_works.slice(start,end)
//     return Promise.all(works.map(async (w: any)=>{
//         w.images = await get_images(w.author_name,w.name)
//         return w
//     }))
// }

// export const list_work_by_author = async (author_id: number, page: number) : Promise<work[]>=>{
//     const partial_works = db_work_author_by_author(author_id)
//     const {start,end} = paginate(page)
//     const works = partial_works.slice(start,end)
//     return Promise.all(works.map(async (w: any)=>{
//         w.images = await get_images(w.author_name,w.name)
//         return w
//     }))
// }
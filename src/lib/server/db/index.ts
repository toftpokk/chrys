
import type { author, db_work, work } from '$lib/types'
import { env as penv } from '$env/dynamic/private'
import Database from 'better-sqlite3'
import { page_size } from '$lib/consts'
import { fuse } from './database'
import { encodePathURI, tag_deserialize } from '$lib/helper'
import { env } from '$env/dynamic/public'

const SIMILAR = 5
export const db = new Database(penv.DB_FILE)

const paginate = (page: number)=>{
    const start = (page-1)*page_size
    const end = page*page_size
    return {start,end}
}

// // DATABASE OPERATIONS

// set

export const setAuthorFav = async (author_id: number, state: boolean)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE author SET favorite = ?
    WHERE author_id = ?
    `).run([Number(state),author_id])
    return state
}

export const setFav = async (work_id: number, state: boolean)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE work SET favorite = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    return state
}

export const setView = async (work_id: number, state: boolean)=>{
    db.prepare(`
    UPDATE work
    SET viewed = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    const info = db.prepare('INSERT INTO history (work_id,datetime,viewed) VALUES (?,?,?)')
                   .run([work_id, Date.now(),Number(state)])
    return Number(info.lastInsertRowid)
}

export const setTag = async (work_id: number, tag_string: string)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE work SET tags = ?
    WHERE work_id = ?
    `).run([tag_string,work_id])
}

export const setSeries = async (work_id: number, series: string)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE work SET series = ?
    WHERE work_id = ?
    `).run([series,work_id])
}

export const setName = async (work_id: number, name: string)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE work SET name = ?
    WHERE work_id = ?
    `).run([name,work_id])
}

export const setPath = async (work_id: number, path: string)=>{
    // TODO use ouput to check changes
    db.prepare(`
    UPDATE work SET path = ?
    WHERE work_id = ?
    `).run([path,work_id])
}

// // GET

// Images

const get_images = async (relpath: string) : Promise<string[]>=>{
    const imagepath = encodePathURI(relpath)
    let images = []
    try{
        const res = await fetch(`${env.PUBLIC_IMAGE_SERVER}/api/repo/${env.PUBLIC_IMAGE_REPO}/${imagepath}`)
        if(!res.ok){
            throw new Error("Response not OK")
        }
        else{
            const data = await res.json()
            images = data["items"]
        }
    }
    catch(error){
        console.log(`Error: Could not get images of ${imagepath} from image server`)
    }
    return images
}

// Single

export const get_author = async (author_id:number)=> {
    return db.prepare(`
    SELECT *
    FROM author
    WHERE author_id = ?
    `).get([author_id]) as author | undefined
}

export const get_work = async (work_id: number) : Promise<work|null> =>{
    const work = db.prepare(`
    SELECT *, w.name AS name, 
              w.path as path,
              w.favorite as favorite, 
              a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE work_id = ?`).get([work_id]) as db_work & {author_name: string}
    if(typeof work === "object"){
        const images = await get_images(work.path)
        return {
            ...work,
            images,
            tags: tag_deserialize(work.tags)
        }
    }
    return null
}

////// JACCARD
const union = function (a : any[], b : any[]) {
    let x : any[] = [];
    function pushx(e : any){
        // not found e in x
        if (!~x.indexOf(e)) x.push(e);
    }
    a.forEach(v=>pushx(v))
    b.forEach(v=>pushx(v))
    return x
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


export const get_similar = async (work_id : number, tags: string[]) =>{
    if(tags.length < 1) return []
    const work = db.prepare(`
    SELECT *
    FROM work
    WHERE active = 1 AND tags != ''
    `).all([]) as (db_work & {author_name: string})[]
    const work_tags = work.map((w)=>{
        const t = tag_deserialize(w.tags)
        const i = intersect(tags,t)
        const u = union(tags,t)
        const j = i.length / u.length

        const images = get_images(w.path)
        return {
            ...w,
            images,
            jaccard: j
        }
    })
    const similar_works = work_tags
        .filter((w)=>w.work_id != work_id)
        .sort((a,b)=>b.jaccard - a.jaccard)
        .slice(0,SIMILAR)
    return similar_works
}

// TODO: use list_work
export const list_work_with_series = async (series_name: string, page: number)=>{
    const query = `
    SELECT *, w.name AS name, 
              w.path as path,
              w.favorite as favorite, 
              a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE series = ?`
    const w = db.prepare(query).all([series_name]) as (db_work & {author_name: string})[]

    const {start,end} = paginate(page)
    const work = w.slice(start,end)
    const num_pages = Math.ceil(w.length/page_size);

    let work_image = Promise.all(work.map(async (w)=>{
        const images = await get_images(w.path)
        return {
            ...w,
            images,
            tags: tag_deserialize(w.tags)
        }
    }))
    return {
        work: work_image,
        num_pages
    }
}
// Lists

export const list_alpha = () =>{
    const query = `
    SELECT DISTINCT upper(substr(name,1,1)) AS name
    FROM work
    WHERE active = 1
    ORDER BY name`
    const output = db.prepare(query).all([]) as {name: string}[]
    const alphabets : string[]= output.map(v=>v.name)
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
        const images = await get_images(w.path)
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

export const list_tags = ()=>{
    const all_tags : Record<string,number> = {}
    const query = `SELECT tags FROM work WHERE tags != '' AND active = 1`
    const output = db.prepare(query).all([]) as {tags: string}[]
    output.forEach((w)=>{
        const tags = tag_deserialize(w.tags)
        tags.forEach((t : string)=>{
            if(!Object.keys(all_tags).includes(t)){
                all_tags[t] = 1
            }
            else{
                all_tags[t]+=1
            }
        })
    })
    return all_tags
}

export const list_series = async ()=>{
    const query = `
    SELECT w.name AS name, 
           w.path AS path,
           w.series as series_name,
           a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE series != '' AND active = 1
    GROUP BY series_name
    ORDER BY name
    `
    const all_series = db.prepare(query).all([]) as {name: string, series_name: string, author_name: string, path: string}[]
    return Promise.all(all_series.map(async (s)=>{
        const images = await get_images(`${s.path}`)
        return {
            ...s,
            image: images[0]
        }
    }))
}

export const list_authors = async ()=>{
    const query = `
    SELECT a.name as name,
           a.favorite as favorite,
           a.author_id as author_id,
           COUNT(w.work_id) as work_count
    FROM author a
    LEFT JOIN work w ON w.author_id = a.author_id
    WHERE active = 1
    GROUP BY a.author_id
    `
    return db.prepare(query).all([]) as {name:string,favorite:1|null,work_count:number,author_id:string}[]
}

// TODO: use list_work
export const list_work_with_tags = async (tag_name: string, page: number)=>{
    const partial_works = db.prepare(`
    SELECT *, w.name AS name, 
              w.path as path,
              w.favorite as favorite, 
              a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.active = 1`).all([]) as (db_work & {author_name: string})[]
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
        const images = await get_images(w.path)
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
            has_compilation?: boolean
            has_viewed?: boolean
        }) : Promise<{work:work[],num_pages:number}>=>{

    let needs_active = options.needs_active || false;
    let partial_works

    let args : unknown[] = []
    let query = `
        SELECT *, w.name AS name, 
                  w.path as path,
                  w.favorite as favorite, 
                  a.name AS author_name
        FROM work w
        LEFT JOIN author a
        ON w.author_id = a.author_id`
    
    // Conditions
    const conditions = []
    if(options.has_compilation === false){
        conditions.push("tags NOT LIKE '%compilation%'")
    }
    if(options.has_viewed === false){
        conditions.push("viewed = 0")
    }
    if(needs_active){
        conditions.push(`active = 1`)
    }
    if(typeof options.author_id === "number"){
        conditions.push(`a.author_id = ?`)
        args.push(options.author_id)
    }
    if(conditions.length > 0){
        const condition_str = conditions.join(" AND ")
        query += ` WHERE ${condition_str}`
    }

    // Sorting
    if(options.sort == "name"){
        query += ` ORDER BY name`
    }
    else if(options.sort == "favorite"){
        query += ` ORDER BY favorite DESC`
    }
    else if(options.sort == "viewed"){
        query += ` ORDER BY viewed DESC`
    }
    else if(options.sort == "author"){
        query += ` ORDER BY author_name`
    }
    else if(options.sort == "id"){
        query += ` ORDER BY work_id DESC`
    }
    else if(options.sort == "random"){
        // See: https://www.sqlite.org/forum/forumpost/e2216583a4
        const today = new Date()
        const dateSum = today.getDay()+today.getMonth()*31+today.getFullYear()
        query += ` ORDER BY SIN(work_id * '${env.PUBLIC_RANDOM_SEED}' * '${dateSum}')`
    }

    partial_works = db.prepare(query).all(args) as (db_work & {author_name: string})[]

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
        return {
            ...w,
            images: [],
            tags: tag_deserialize(w.tags)
        }
    }))
    return {
        num_pages,
        work: result
    }
}
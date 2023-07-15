import Database from 'better-sqlite3'
import type { author, db_work, work } from '$lib/types'
import { page_size } from '$lib/consts'
import {DB_FILE } from '$env/static/private'
import { PUBLIC_IMAGE_SERVER, PUBLIC_IMAGE_REPO } from '$env/static/public'
const db = new Database(DB_FILE)

const paginate = (page: number)=>{
    const start = (page-1)*page_size
    const end = page*page_size
    return {start,end}
}

const create_author = ()=>{
    const sql = db.prepare(`
    CREATE TABLE IF NOT EXISTS author (
        author_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT VARCHAR(50),
        path VARCHAR(50)
    )`)
    sql.run()
}

const create_work = ()=>{
    const sql = db.prepare(`
    CREATE TABLE IF NOT EXISTS work (
        work_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50),
        path VARCHAR(50),
        author_id INTEGER,
        viewed INTEGER(1),
        favorite INTEGER(1),
        tags VARCHAR(100),
        FOREIGN KEY(author_id) REFERENCES author(author_id)
    )`)
    sql.run()
}

export const init_table = async ()=>{
    console.log("Initializing Tables")
    create_author()
    create_work()
    console.log("Syncing Tables...")
    const work_list = await scan()
    await sync(work_list)
    console.log("Syncing Tables Done!")
}

const sync = async (work_list : Record<string,string[]>)=>{
    const author_names = Object.keys(work_list)
    author_names.map(async (author_name)=>{
        let author_id = -1
        const author = db_author_by_name(author_name)
        if(typeof author === "object"){
            author_id = author.author_id
        }
        else{
            author_id = db_insert_author(author_name,author_name)
        }
        work_list[author_name].map(async (work_name)=>{
            let work_id = -1
            const work = db_work_by_name_author(work_name,author_id)
            if(typeof work === "object"){
                work_id = work.work_id
            }
            else{
                work_id = db_insert_work(work_name, `${author_name}/${work_name}`,author_id,[])
            }
        })
    })
}

const scan = async ()=>{
    let author_list : string[] = []
    let work_list : Record<string,string[]> = {}

    const res = await fetch(`${PUBLIC_IMAGE_SERVER}/api/repo/${PUBLIC_IMAGE_REPO}/`)
    if(!res.ok){
        console.log(`Could not get author list image server ${PUBLIC_IMAGE_SERVER}`)
    }
    else{
        const data = await res.json()
        author_list = data["dirs"]
    }
    await Promise.all(author_list.map(async (author)=>{
        const res = await fetch(`${PUBLIC_IMAGE_SERVER}/api/repo/${PUBLIC_IMAGE_REPO}/${author}`)
        let works = []
        if(!res.ok){
            console.log(`Could not get works from author '${author}' from image server ${PUBLIC_IMAGE_SERVER}`)
        }
        else{
            const data = await res.json()
            works = data["subdirs"]
        }
        work_list[author] = works
    }))
    return work_list
}

// // DATABASE OPERATIONS

const db_insert_author = (name: string, path: string): number =>{
    const info = db.prepare('INSERT INTO author (name,path) VALUES (?,?)')
                   .run([name, path])
    return Number(info.lastInsertRowid)
}

const db_insert_work = (name: string, path: string, author_id: number,tags: string[]) : number =>{
    const t = tags.join(" ")
    const info = db.prepare('INSERT INTO work (name,path,author_id,viewed,favorite,tags) VALUES (?,?,?,?,?,?)')
                   .run([name, path, author_id, 0, 0,t])
    return Number(info.lastInsertRowid)
}

const db_author_by_name = (name: string): author | undefined => {
    const a : any = db.prepare('SELECT * FROM author WHERE name = ?')
                           .get([name])
    return a
}

const db_author_by_id = (author_id: number): author | undefined => {
    const a : any = db.prepare('SELECT * FROM author WHERE author_id = ?')
                           .get([author_id])
    return a
}

const db_work_by_name_author = (name: string, author_id: number): db_work | undefined =>{
    const w : any= db.prepare('SELECT * FROM work WHERE name = ? AND author_id = ?')
                           .get([name,author_id])
    return w
}

const db_work_by_id = (work_id: number): db_work | undefined =>{
    const w : any = db.prepare('SELECT * FROM work WHERE work_id = ?')
                      .get([work_id])
    return w
}

const db_work_author_by_id = (work_id:number) : any | undefined =>{
    const w : any = db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.work_id = ?
    `).get([work_id])
    return w
}

const db_work_author_by_author = (author_id:number) : any | undefined =>{
    const w : any = db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.author_id = ?
    `).all([author_id])
    return w
}

const db_work_author = () : work[] =>{
    const ws : any[] = db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    `).all([])
    return ws
}

export const setFav = async (work_id: number, state: boolean)=>{
    const fav = db.prepare(`
    UPDATE work SET favorite = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    return state
}

export const setView = async (work_id: number, state: boolean)=>{
    const fav = db.prepare(`
    UPDATE work SET viewed = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    return state
}

export const setTag = async (work_id: number, tag_string: string)=>{
    
    db.prepare(`
    UPDATE work SET tags = ?
    WHERE work_id = ?
    `).run([tag_string,work_id])
}

const get_images = async (author_name:string,work_name:string) : Promise<string[]>=>{
    const author_comp = encodeURIComponent(author_name)
    const work_comp = encodeURIComponent(work_name)
    const res = await fetch(`${PUBLIC_IMAGE_SERVER}/api/repo/${PUBLIC_IMAGE_REPO}/${author_comp}/${work_comp}`)
    let images = []
    if(!res.ok){
        console.log(`Could not get images of work '${work_name} by ${author_name}' from image server ${PUBLIC_IMAGE_SERVER}`)
    }
    else{
        const data = await res.json()
        images = data["items"]
    }
    return images
}

export const get_author = async (author_id:number) : Promise<author|null>=> {
    const author = db_author_by_id(author_id)
    if(typeof author === "object"){
        return author
    }
    return null
}

export const get_work = async (work_id: number) : Promise<work|null> =>{
    const work = db_work_author_by_id(work_id)
    if(typeof work === "object"){
        work.images = await get_images(work.author_name,work.name)
        if(work.tags === ''){
            work.tags = []
        }
        else{
            work.tags = work.tags.split(' ')
        }
        return work
    }
    return null
}

// Sorting
const sort_name = (a:work,b:work)=>{
    const a_name = a.name
    const b_name = b.name
    if(a_name == b_name){
        return 0
    }
    if(a_name > b_name){
        return 1
    }
    return -1
}

const sort_fav = (a:work,b:work)=>{
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

const sort_view = (a:work,b:work)=>{
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

const sort_author = (a:work,b:work)=>{
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

export const list_work = async (page: number, sort: string) : Promise<work[]>=>{
    const partial_works = db_work_author()
    if(sort === "name"){
        partial_works.sort(sort_name)
    }
    else if(sort === "favorite"){
        partial_works.sort(sort_fav)
    }
    else if(sort === "viewed"){
        partial_works.sort(sort_view)
    }
    else if(sort === "author"){
        partial_works.sort(sort_author)
    }
    const {start,end} = paginate(page)
    const works = partial_works.slice(start,end)
    for(let w of works){
        w.images = await get_images(w.author_name,w.name)
    }
    return works
}

export const list_work_by_author = async (author_id: number, page: number) : Promise<work[]>=>{
    const partial_works = db_work_author_by_author(author_id)
    const {start,end} = paginate(page)
    const works = partial_works.slice(start,end)
    for(let w of works){
        w.images = await get_images(w.author_name,w.name)
    }
    return works
}
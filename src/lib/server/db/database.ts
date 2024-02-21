import Database from 'better-sqlite3'
import { env as penv } from '$env/dynamic/private'
import { env } from '$env/dynamic/public'
import { tag_serialize } from '$lib/helper'
import type { author, db_history, db_work, work } from '$lib/types'
import Fuse from 'fuse.js'

export const db = new Database(penv.DB_FILE)
export let fuse : Fuse<ReturnType<typeof select_work_authors>[0]>;

const initialize = ()=>{
    console.log("Initializing Tables")
    create_author()
    create_work()
    create_history()
    add_series_if_not_exist()
}

export const begin_hook = ()=>{
    initialize()
    fuse = new Fuse(select_work_authors(),{
        keys: ['name','tags']
    })
}

export const init_table = async ()=>{
    // Initializes all tables and syncs data
    initialize()
    console.log("Syncing Tables...")
    const work_list = await scan()
    await sync(work_list)
    console.log("Syncing Tables Done!")
    fuse = new Fuse(select_work_authors(),{
        keys: ['name','tags']
    })
}

// // Table & Syncing

const create_author = ()=>{
    // Creates author table
    db.prepare(`
    CREATE TABLE IF NOT EXISTS author (
        author_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT VARCHAR(50),
        favorite INTEGER(1),
        path VARCHAR(50)
    )`).run()
}

const create_work = ()=>{
    // Creates work table
    db.prepare(`
    CREATE TABLE IF NOT EXISTS work (
        work_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50),
        path VARCHAR(50),
        author_id INTEGER,
        viewed INTEGER(1),
        favorite INTEGER(1),
        series VARCHAR(50),
        tags VARCHAR(100),
        active INTEGER(1),
        FOREIGN KEY(author_id) REFERENCES author(author_id)
    )`).run()
}

const add_series_if_not_exist = ()=>{
    // Add active column if does not exist
    const table_info : any = db.prepare("PRAGMA table_info(work)").all()
    const col_names = table_info.map((c: any)=>(c.name))
    if(!col_names.includes("series")){
        db.prepare("ALTER TABLE work ADD series VARCHAR(50)").run()
        console.log("Warning: no column series")
    }
    console.log("Warning: series ok")
}

const create_history = ()=>{
    db.prepare(`
    CREATE TABLE IF NOT EXISTS history (
        history_id INTEGER PRIMARY KEY AUTOINCREMENT,
        work_id INTEGER,
        datetime INTEGER,
        viewed INTEGER(1),
        FOREIGN KEY(work_id) REFERENCES work(work_id)
    )`).run()
}

const scan = async ()=>{
    // Scans image server for images
    let author_list : string[] = []
    let work_list : Record<string,string[]> = {}
    let res : Response;
    try {
        res = await fetch(`${env.PUBLIC_IMAGE_SERVER}/api/repo/${env.PUBLIC_IMAGE_REPO}/`)
        if(!res.ok){
            throw new Error("Response not OK")
        }
        else{
            const data = await res.json()
            author_list = data["dirs"]
        }
    } catch (error) {
        console.log(`Error: Could not get author list image server ${env.PUBLIC_IMAGE_SERVER}: ${error}`)
    } finally {
        work_list = {}
    }
    
    await Promise.all(author_list.map(async (author)=>{
        const res = await fetch(`${env.PUBLIC_IMAGE_SERVER}/api/repo/${env.PUBLIC_IMAGE_REPO}/${author}`)
        let works = []
        if(!res.ok){
            console.log(`Could not get works from author '${author}' from image server ${env.PUBLIC_IMAGE_SERVER}`)
        }
        else{
            const data = await res.json()
            works = data["subdirs"]
        }
        work_list[author] = works
    }))
    return work_list
}

const sync = async (scanned_work_list : Record<string,string[]>)=>{
    // Syncs local sqlite to image server
    const author_names = Object.keys(scanned_work_list)
    const author_id_list : number[] = []
    // author additive sync
    author_names.forEach(async (author_name)=>{
        let author_id = -1
        const author = select_author_with_name(author_name)
        if(typeof author === "object"){
            // old author_id
            author_id = author.author_id
        }
        else{
            // new author_id
            author_id = insert_author(author_name,author_name)
        }
        author_id_list.push(author_id)
        scanned_work_list[author_name].map(async (work_name)=>{
            let work_id = -1
            const work = select_work_with_name_author(work_name,author_id)
            if(typeof work === "object"){
                // old work_id
                work_id = work.work_id
                update_active(work_id,true)
            }
            else{
                // new work_id
                work_id = insert_work(work_name, `${author_name}/${work_name}`,author_id,[])
            }
        })
    })
    // author subtractive sync
    const partial_work = select_work_authors()
    partial_work.forEach(async (work)=>{
        if (!author_id_list.includes(work.author_id)){
            // not exists
            update_active(work.work_id,false)
            return
        }
        // work subtractive sync
        if(!scanned_work_list[work.author_name].includes(work.name)){
            update_active(work.work_id,false)
        }else{
            // work additive sync
            update_active(work.work_id,true)
        }
        // console.log(author_id_list[work.author_id])
    })
}

// // Database Operations

// Insert

const insert_author = (name: string, path: string): number =>{
    const info = db.prepare('INSERT INTO author (name,path) VALUES (?,?)')
                   .run([name, path])
    return Number(info.lastInsertRowid)
}

const insert_work = (name: string, path: string, author_id: number,tags: string[], active=true, series="") : number =>{
    const t = tag_serialize(tags)
    let active_val = active?1:0;
    const info = db.prepare('INSERT INTO work (name,path,author_id,viewed,favorite,tags,series,active) VALUES (?,?,?,?,?,?,?,?)')
                   .run([name, path, author_id, 0, 0,t,series,active_val])
    return Number(info.lastInsertRowid)
}

const insert_history = (work_id:number,unixtime:number,viewed:boolean)=>{
    let viewed_val = viewed?1:0;
    const info = db.prepare('INSERT INTO history (work_id,datetime,viewed) VALUES (?,?,?)')
                   .run([work_id, unixtime,viewed_val])
    return Number(info.lastInsertRowid)
}

// Select

const select_author_with_name = (name: string): author | undefined => {
    return db.prepare('SELECT * FROM author WHERE name = ?')
             .get([name]) as author | undefined
}

const select_work_with_name_author = (name: string, author_id: number): db_work | undefined =>{
    return db.prepare('SELECT * FROM work WHERE name = ? AND author_id = ?')
             .get([name,author_id]) as db_work | undefined
}

export const select_author_with_id = (work_id:number)=>{
    return db.prepare(`
    SELECT *
    FROM author
    WHERE author_id = ?
    `).get([work_id]) as author | undefined
}

export const select_works = () =>{
    return db.prepare(`
    SELECT *
    FROM work
    WHERE active = 1
    `).all([]) as db_work[]
}

export const select_work_authors = () =>{
    return db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.series,w.active,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.active = 1
    `).all([]) as (db_work & {author_name: string})[]
}

export const select_work_author_with_id = (work_id: number) =>{
    return db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.series,w.active,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.active = 1 AND w.work_id = ?
    `).get([work_id]) as db_work & {author_name: string}
}

export const select_work_authors_with_id = (author_id: number,needs_active: boolean) =>{
    let sql;
    if(needs_active){
        sql=`
        SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.series,w.active,a.name AS author_name
        FROM work w
        LEFT JOIN author a
        ON w.author_id = a.author_id
        WHERE w.active = 1 AND a.author_id = ?
        `
    }
    else{
        sql=`
        SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.series,w.active,a.name AS author_name
        FROM work w
        LEFT JOIN author a
        ON w.author_id = a.author_id
        WHERE a.author_id = ?
        `
    }
    return db.prepare(sql).all([author_id]) as (db_work & {author_name: string})[]
}

export const select_authors = ()=>{
    return db.prepare(`
    SELECT *
    FROM author
    `).all([]) as author[]
}

export const select_histories = ()=>{
    return db.prepare(`
    SELECT h.history_id,h.datetime,h.viewed,w.name,w.work_id
    FROM history h
    LEFT JOIN work w
    ON w.work_id = h.work_id
    `).all([]) as db_history[]
}

// updates

const update_active = async (work_id: number, state: boolean)=>{
    db.prepare(`
    UPDATE work SET active = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    return state
}

export const update_view = async (work_id: number, state: boolean)=>{
    db.prepare(`
    UPDATE work SET viewed = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    insert_history(work_id,Date.now(),state)
    return state
}

export const update_favorite = async (work_id: number, state: boolean)=>{
    db.prepare(`
    UPDATE work SET favorite = ?
    WHERE work_id = ?
    `).run([Number(state),work_id])
    return state
}

export const update_tag = async (work_id: number, tag_string: string)=>{
    db.prepare(`
    UPDATE work SET tags = ?
    WHERE work_id = ?
    `).run([tag_string,work_id])
}

export const update_series = async (work_id: number, series: string)=>{
    db.prepare(`
    UPDATE work SET series = ?
    WHERE work_id = ?
    `).run([series,work_id])
}

export const update_author_favorite = async (author_id: number, state: boolean)=>{
    db.prepare(`
    UPDATE author SET favorite = ?
    WHERE author_id = ?
    `).run([Number(state),author_id])
    return state
}
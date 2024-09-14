import Database from 'better-sqlite3'
import { env as penv } from '$env/dynamic/private'
import { env } from '$env/dynamic/public'
import { encodePathURI, tag_serialize } from '$lib/helper'
import type { author, db_history, db_work, work } from '$lib/types'
import Fuse from 'fuse.js'

export const db = new Database(penv.DB_FILE)
export let fuse : Fuse<ReturnType<typeof select_work_authors>[0]>;

const initialize = ()=>{
    console.log("Initializing Tables")
    create_author()
    create_work()
    create_history()
    add_updates_if_not_exist()
    create_trigger()
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
        cover VARCHAR(50),
        author_id INTEGER,
        viewed INTEGER(1),
        favorite INTEGER(1),
        series VARCHAR(50),
        tags VARCHAR(100),
        active INTEGER(1),
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY(author_id) REFERENCES author(author_id)
    )`).run()
}

const add_updates_if_not_exist = ()=>{
    // Add active column if does not exist
    const table_info : any = db.prepare("PRAGMA table_info(work)").all()
    const col_names = table_info.map((c: any)=>(c.name))
    if(!col_names.includes("created_at")){
        db.prepare("ALTER TABLE work ADD created_at VARCHAR(50)").run()
        console.log("Warning: no column created_at")
    }
    if(!col_names.includes("updated_at")){
        db.prepare("ALTER TABLE work ADD updated_at VARCHAR(50)").run()
        console.log("Warning: no column updated_at")
    }
    console.log("Warning: updated_at,created_at ok")
}

const create_trigger = ()=>{
    db.prepare(`CREATE TRIGGER IF NOT EXISTS update_work_updated_at 
    BEFORE UPDATE
        ON work
    BEGIN
        UPDATE work
            SET updated_at = strftime('%Y-%m-%dT%H:%M:%S:%s', 'now', 'localtime') 
        WHERE work_id = old.work_id;
    END;`).run()
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

// TODO merge with other image function
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
        scanned_work_list[author_name].map(async (work_slug)=>{
            let work_id = -1
            const relpath = `${author_name}/${work_slug}` 
            const work = select_work_with_path_author(relpath,author_id)
            if(typeof work === "object"){
                // old work_id
                let images = await get_images(work.path)
                work_id = work.work_id
                update_active(work_id,true)
                update_cover(work_id,images[0])
            }
            else{
                // new work_id
                let images = await get_images(`${author_name}/${work_slug}`)
                work_id = insert_work(work_slug, `${author_name}/${work_slug}`,author_id,[],images[0])
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
        
        const work_slug = work.path.split("/")[1]
        // work subtractive sync
        if(!scanned_work_list[work.author_name].includes(work_slug)){
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

const insert_work = (name: string, path: string, author_id: number,tags: string[], cover: string, active=true, series="") : number =>{
    const t = tag_serialize(tags)
    let active_val = active?1:0;
    // Remove nanosecs
    const now = new Date().toISOString().replace(/\..+/,'')
    const info = db.prepare('INSERT INTO work (name,path,author_id,viewed,favorite,tags,series,active,cover,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
                   .run([name, path, author_id, 0, 0,t,series,active_val,cover, now, now])
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

const select_work_with_path_author = (path: string, author_id: number): db_work | undefined =>{
    return db.prepare('SELECT * FROM work WHERE path = ? AND author_id = ?')
             .get([path,author_id]) as db_work | undefined
}

export const select_work_authors = () =>{
    return db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.series,w.active,w.cover,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.active = 1
    `).all([]) as (db_work & {author_name: string})[]
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

const update_cover = async (work_id: number, cover: string)=>{
    db.prepare(`
    UPDATE work SET cover = ?
    WHERE work_id = ?
    `).run([cover,work_id])
    return
}
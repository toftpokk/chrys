import Database from 'better-sqlite3'
import {DB_FILE } from '$env/static/private'
import { PUBLIC_IMAGE_SERVER, PUBLIC_IMAGE_REPO } from '$env/static/public'
import { tag_serialize } from '$lib/helper'
import type { author, db_work, work } from '$lib/types'

export const db = new Database(DB_FILE)

export const init_table = async ()=>{
    // Initializes all tables and syncs data
    console.log("Initializing Tables")
    create_author()
    create_work()
    add_active_if_not_exist()
    console.log("Syncing Tables...")
    const work_list = await scan()
    await sync(work_list)
    console.log("Syncing Tables Done!")
}

// // Table & Syncing

const create_author = ()=>{
    // Creates author table
    db.prepare(`
    CREATE TABLE IF NOT EXISTS author (
        author_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT VARCHAR(50),
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
        tags VARCHAR(100),
        active INTEGER(1),
        FOREIGN KEY(author_id) REFERENCES author(author_id)
    )`).run()
}

const add_active_if_not_exist = ()=>{
    // Add active column if does not exist
    const table_info : any = db.prepare("PRAGMA table_info(work)").all()
    const col_names = table_info.map((c: any)=>(c.name))
    if(!col_names.includes("active")){
        db.prepare("ALTER TABLE work ADD active INTEGER(1)").run()
        console.log("Warning: no column active")
    }
}

const scan = async ()=>{
    // Scans image server for images
    let author_list : string[] = []
    let work_list : Record<string,string[]> = {}
    let res : Response;
    try {
        res = await fetch(`${PUBLIC_IMAGE_SERVER}/api/repo/${PUBLIC_IMAGE_REPO}/`)
        if(!res.ok){
            throw new Error("Response not OK")
        }
        else{
            const data = await res.json()
            author_list = data["dirs"]
        }
    } catch (error) {
        console.log(`Error: Could not get author list image server ${PUBLIC_IMAGE_SERVER}`)
    } finally {
        work_list = {}
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

const sync = async (work_list : Record<string,string[]>)=>{
    // Syncs local sqlite to image server
    const author_names = Object.keys(work_list)
    const author_id_list : number[] = []
    // additive sync
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
        work_list[author_name].map(async (work_name)=>{
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
    // subtractive sync
    const partial_work = select_work_authors()
    partial_work.forEach(async (work)=>{
        if (!author_id_list.includes(work.author_id)){
            // not exists
            update_active(work.work_id,false)
        }
    })
}

// // Database Operations

// Insert

const insert_author = (name: string, path: string): number =>{
    const info = db.prepare('INSERT INTO author (name,path) VALUES (?,?)')
                   .run([name, path])
    return Number(info.lastInsertRowid)
}

const insert_work = (name: string, path: string, author_id: number,tags: string[], active=true) : number =>{
    const t = tag_serialize(tags)
    let active_val = active?1:0;
    const info = db.prepare('INSERT INTO work (name,path,author_id,viewed,favorite,tags,active) VALUES (?,?,?,?,?,?,?)')
                   .run([name, path, author_id, 0, 0,t,active_val])
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
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
    FROM work w
    LEFT JOIN author a
    ON w.author_id = a.author_id
    WHERE w.active = 1
    `).all([]) as (db_work & {author_name: string})[]
}

export const select_work_author_with_id = (work_id: number) =>{
    return db.prepare(`
    SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
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
        SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
        FROM work w
        LEFT JOIN author a
        ON w.author_id = a.author_id
        WHERE w.active = 1 AND a.author_id = ?
        `
    }
    else{
        sql=`
        SELECT w.work_id,w.name,w.path,w.author_id,w.favorite,w.viewed,w.tags,w.active,a.name AS author_name
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
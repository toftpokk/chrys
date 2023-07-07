import sqlite from 'sqlite3'
import type { work } from '../../types'
import { image_server } from '$lib/consts'

const WORK_ROOT = './static/works'
sqlite.verbose()
const db = new sqlite.Database('./db.sqlite')
const CACHE = []

function get(sql: string, params: any[]) {
    return new Promise<any>((resolve, reject) => {
        db.get(sql, params, (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res)
            }
        })
    })
}

function all(sql: string, params: any[]) {
    return new Promise<any[]>((resolve, reject) => {
        db.all(sql, params, (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(res)
            }
        })
    })
}

function run(sql: string, params: any[]) {
    return new Promise<{id:number}>((resolve, reject) => {
        db.run(sql, params, function (err) { // use function to get lastID
            if (err) {
                reject(err)
            }
            else {
                resolve({ id: this.lastID })
            }
        })
    })
}

function create_author() {
    const sql = `
    CREATE TABLE IF NOT EXISTS author (
        author_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT VARCHAR(50),
        path VARCHAR(50)
    )`
    db.run(sql)
}

function create_work() {
    const sql = `
    CREATE TABLE IF NOT EXISTS work (
        work_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50),
        path VARCHAR(50),
        author_id INTEGER,
        viewed INTEGER(1),
        favorite INTEGER(1),
        tags VARCHAR(100),
        FOREIGN KEY(author_id) REFERENCES author(author_id)
    )`
    db.run(sql)
}

export async function init_table() {
    console.log("Initializing Tables")
    create_author()
    create_work()
    const work_list = await scan()
}

async function scan(){
    let author_list : string[] = []
    let work_list : Record<string,string[]> = {}

    const res = await fetch(`${image_server}/api/repo/works/`)
    if(!res.ok){
        console.log(`Could not get author list image server ${image_server}`)
    }
    else{
        const data = await res.json()
        author_list = data["dirs"]
    }
    await Promise.all(author_list.map(async (author)=>{
        const res = await fetch(`${image_server}/api/repo/works/${author}`)
        let works = []
        if(!res.ok){
            console.log(`Could not get works from author '${author}' from image server ${image_server}`)
        }
        else{
            const data = await res.json()
            works = data["subdirs"]
        }
        work_list[author] = works
    }))
    return work_list
}

export async function list_work() : Promise<work[]>{
    return []
}

init_table()
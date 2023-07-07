import sqlite from 'sqlite3'
import type { work } from '../../types'

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
    const {author_list,work_list} = await scan()
    console.log(author_list)
}

async function scan(){
    const author_list = []
    const work_list = []

    const authors = await readdir(WORK_ROOT);

    for(let a_idx=0;a_idx<authors.length;a_idx++){
        const author_name = authors[a_idx];
        const author = {
            name: author_name,
            proto_author_id: a_idx, // temporary id
            path: "/"+author_name
        }

        author_list.push(author)
        
        const works = await readdir(`${WORK_ROOT}/${author_name}`)
        for(let w_idx=0;w_idx<works.length;w_idx++){
            const work_name = works[w_idx]
            const isdir = (await lstat(`${WORK_ROOT}/${author_name}/${work_name}`)).isDirectory()
            if(!isdir){
                continue // skip zip files
            }
            const work = {
                name: work_name,
                path: "/"+author_name+"/"+work_name,
                proto_author_id: a_idx,
                viewed: false,
                favorite: false,
                tags: ["test1","test2"]
            }
            work_list.push(work)
        }
    }
    return {author_list, work_list}
}

export async function list_work() : Promise<work[]>{
    return []
}

init_table()
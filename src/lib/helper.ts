import { env } from '$env/dynamic/public';
import type { work } from './types';
export const get_page = (searchParams: URLSearchParams)=>{
    const page_str = searchParams.get("page")
    return page_str ? Number(page_str) : 1
}

export const emptyWork : work = {
    work_id: -1,
    name: "Unnamed Work",
    path: "",
    author_id: -1,
    favorite: false,
    viewed: false,
    // bookmark: false,
    series: "",
    tags: [],
    active: true,
    author_name: "Unnamed Author",
    images: []
}

export const IsEmptySeries = (seriesString : string | null)=>{
    if(seriesString == ""){
        return true
    } else if(seriesString == null){
        return true
    }
    return false
}

export const tag_serialize = (tags : string[]) =>{
    return tags.join(" ")
}

export const tag_deserialize = (tag_string : string)=>{
    let tags : string[];
    if(tag_string === ''){
        tags = []
    }
    else{
        tags = tag_string.split(' ')
    }
    return tags
}

export const get_tag_suggestions = ()=>{
    const tag_suggestions = 
    env.PUBLIC_TAG_SUGGESTIONS
    .split("\n\n").map(
        (t)=>{
            const linesplits = t.trim().split("\n")
            return {
                name: linesplits[0],
                tags: linesplits.slice(1).join(" ").split(" ")
                    .filter((t)=>t != "")
            }
        }
    )
    return tag_suggestions
}
export const encodePathURI = (path: string) : string=>{
    return path.split("/")
        .map(string=>encodeURIComponent(string))
        .join("/")
}
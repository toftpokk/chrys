import { PUBLIC_TAG_SUGGESTIONS } from '$env/static/public';
export const get_page = (searchParams: URLSearchParams)=>{
    const page_str = searchParams.get("page")
    return page_str ? Number(page_str) : 1
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
    const suggestion_subset = PUBLIC_TAG_SUGGESTIONS.split('\n')
    const tag_suggestions = suggestion_subset.map((tag_subset)=>(
        tag_subset.split(" ")
    ))
    return tag_suggestions
}
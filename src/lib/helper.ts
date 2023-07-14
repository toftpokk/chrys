export const get_page = (searchParams: URLSearchParams)=>{
    const page_str = searchParams.get("page")
    return page_str ? Number(page_str) : 1
}
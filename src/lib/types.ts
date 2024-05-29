export interface db_work {
    // work
    work_id: number;
    name: string;
    path: string;
    // author
    author_id: number;

    favorite: boolean;
    viewed: boolean;
    tags: string;
    series: string;
    cover: string;
    active: boolean;
}

export interface work extends Omit<db_work,"tags"> {
    author_name: string;
    tags: string[];
    images: string[];
}

export interface author{
    author_id: number;
    name: string;
    path: string;
    favorite: boolean;
}

export interface db_history{
    history_id:number;
    datetime:number;
    viewed:number;
    name:string;
    work_id:number;
}
export interface db_work{
    // work
    work_id: number;
    name: string;
    path: string;
    // author
    author_id: number;

    favorite: boolean;
    viewed: boolean;
    tags: string[];
    active: boolean;
}

export interface work extends db_work{
    author_name: string;
    images: string[];
}

export interface author{
    author_id: number;
    name: string;
    path: string;
}
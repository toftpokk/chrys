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
}
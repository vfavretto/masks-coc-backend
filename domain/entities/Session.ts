export interface Clue {
    id: string;
    name: string;
    description:string;
    type: string
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: string;
}

export interface Session {
    id: string;
    title: string;
    date: string;
    location: string;
    summary: string;
    details: string;
    tags: string[];
    images: string[];
    clues: Clue[];
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}
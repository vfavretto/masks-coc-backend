export interface Stats {
    For: number;
    Con: number;
    Tam: number;
    Des: number;
    Apa: number;
    Edu: number;
    Int: number;
    Pod: number;
}

export interface MentalHealth {
    sanity: number;
    maxSanity: number;
    tempSanity: boolean;
    indefiniteSanity: boolean;
    phobias: string[];
    manias: string[];
}

export interface Skill {
    name: string;
    value: number;
    category: 'combat' | 'academic' | 'pratical' | 'social';
}

export interface Equipment {
    name: string;
    description: string;
    type: 'weapon' | 'tool' | 'book' | 'artifact';
}

export interface Character {
    id: string;
    name: string;
    occupation: string;
    image: string;
    stats: Stats;
    background: string;
    mentalHealth: MentalHealth;
    skills: Skill[];
    equipment: Equipment[];
    pulpTalents: string[];
    wounds: number;
    maxHealth: number;
    createdAt: Date;
    updatedAt: Date;
}
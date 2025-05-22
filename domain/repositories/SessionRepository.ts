import { Session } from "../entities/Session";

export interface SessionRepository {
    findAll(): Promise<Session[]>;
    findById(id: string): Promise<Session | null>;
    findByTags(tags: string[]): Promise<Session[]>;
    search(term: string): Promise<Session[]>;
    create(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session>;
    update(id: string, session: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Session | null>;
    delete(id: string): Promise<boolean>;
}

import { Character } from "../entities/Character";

export interface CharacterRepository {
    findAll(): Promise<Character[]>;
    findById(id: string): Promise<Character | null>;
    create(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character>;
    update(id: string, character: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Character | null>;
    delete(id: string): Promise<boolean>;
}
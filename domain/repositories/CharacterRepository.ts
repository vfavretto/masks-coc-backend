import { Character } from '../entities/Character';

export interface CharacterRepository {
    findAll(): Promise<Character[]>;
    findById(id: string): Promise<Character | null>;
    create(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character>;
    update(id: string, character: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Character | null>;
    delete(id: string): Promise<boolean>;
}
import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';
import { CharacterModel, CharacterDocument } from '../models/CharacterModel';

export class MongoCharacterRepository implements CharacterRepository {
    private documentToEntity(doc: CharacterDocument): Character {
        return {
            id: doc.id.toString(),
            name: doc.name,
            occupation: doc.occupation,
            image: doc.image,
            stats: doc.stats,
            background: doc.background,
            mentalHealth: doc.mentalHealth,
            skills: doc.skills.map(skill => ({
                name: skill.name,
                value: skill.value,
                category: skill.category as 'combat' | 'academic' | 'pratical' | 'social'
            })),
            equipment: doc.equipment.map(item => ({
                name: item.name,
                type: item.type as 'weapon' | 'tool' | 'book' | 'artifact',
                description: item.description
            })),
            pulpTalents: doc.pulpTalents,
            wounds: doc.wounds,
            maxHealth: doc.maxHealth,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }
    }

    async findAll(): Promise<Character[]> {
        const characters = await CharacterModel.find();
        return characters.map(character => this.documentToEntity(character));
    }

    async findById(id: string): Promise<Character | null> {
        const character = await CharacterModel.findById(id);
        return character ? this.documentToEntity(character) : null;
    }
    
    async create(characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
        const newCharacter = await CharacterModel.create(characterData);
        return this.documentToEntity(newCharacter);
    }

    async update(id: string, characterData: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Character | null> {
        const updatedCharacter = await CharacterModel.findByIdAndUpdate(
            id,
            { $set: characterData },
            { new: true }
        );
        return updatedCharacter ? this.documentToEntity(updatedCharacter) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CharacterModel.findByIdAndDelete(id);
        return !!result;
    }
}
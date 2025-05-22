import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';

type CreateCharacterDTO = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;

export class CreateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(data: CreateCharacterDTO): Promise<Character> {
    return this.characterRepository.create(data);
  }
}
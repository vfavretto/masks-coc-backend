import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

type UpdateCharacterDTO = Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>;

export class UpdateCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(id: string, data: UpdateCharacterDTO): Promise<Character> {
    const updatedCharacter = await this.characterRepository.update(id, data);
    
    if (!updatedCharacter) {
      throw new NotFoundError('Character not found');
    }
    
    return updatedCharacter;
  }
}
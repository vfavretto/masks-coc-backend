import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class GetCharacterByIdUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(id: string): Promise<Character> {
    const character = await this.characterRepository.findById(id);
    
    if (!character) {
      throw new NotFoundError('Character not found');
    }
    
    return character;
  }
}
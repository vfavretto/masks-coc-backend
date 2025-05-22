import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class DeleteCharacterUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.characterRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError('Character not found');
    }
  }
}
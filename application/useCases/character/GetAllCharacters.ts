import { Character } from '../../../domain/entities/Character';
import { CharacterRepository } from '../../../domain/repositories/CharacterRepository';

export class GetAllCharactersUseCase {
  constructor(private characterRepository: CharacterRepository) {}

  async execute(): Promise<Character[]> {
    return this.characterRepository.findAll();
  }
}
import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class DeleteSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.sessionRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError('Session not found');
    }
  }
}
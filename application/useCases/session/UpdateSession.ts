import { Session } from '../../../domain/entities/Session';
import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

type UpdateSessionDTO = Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>;

export class UpdateSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(id: string, data: UpdateSessionDTO): Promise<Session> {
    const updatedSession = await this.sessionRepository.update(id, data);
    
    if (!updatedSession) {
      throw new NotFoundError('Session not found');
    }
    
    return updatedSession;
  }
}
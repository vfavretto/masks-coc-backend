import { Session } from '../../../domain/entities/Session';
import { SessionRepository } from '../../../domain/repositories/SessionRepository';

type CreateSessionDTO = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export class CreateSessionUseCase {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(data: CreateSessionDTO): Promise<Session> {
    return this.sessionRepository.create(data);
  }
}





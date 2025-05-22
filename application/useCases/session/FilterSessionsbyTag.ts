import { Session } from '../../../domain/entities/Session';
import { SessionRepository } from '../../../domain/repositories/SessionRepository';

export class FilterSessionsByTag {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(tags: string[]): Promise<Session[]> {
    return this.sessionRepository.findByTags(tags);
  }
}
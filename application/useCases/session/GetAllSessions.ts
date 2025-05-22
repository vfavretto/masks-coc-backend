import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { Session } from '../../../domain/entities/Session';

export class GetAllSessions {
    constructor(private readonly sessionRepository: SessionRepository) {}
    
    async execute(): Promise<Session[]> {
        return this.sessionRepository.findAll();
    }
}
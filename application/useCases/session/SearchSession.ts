import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { Session } from '../../../domain/entities/Session';

export class SearchSession {
    constructor(private readonly sessionRepository: SessionRepository) {}
    
    async execute(term: string): Promise<Session[]> {
        return this.sessionRepository.search(term);
    }
}
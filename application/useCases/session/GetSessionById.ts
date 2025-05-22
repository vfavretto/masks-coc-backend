import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { Session } from '../../../domain/entities/Session';
import { NotFoundError } from '../../../shared/errors';

export class GetSessionById {
    constructor(private readonly sessionRepository: SessionRepository) {}
    
    async execute(id: string): Promise<Session | null> {
        const session = await this.sessionRepository.findById(id);

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        
        return this.sessionRepository.findById(id);
    }
}
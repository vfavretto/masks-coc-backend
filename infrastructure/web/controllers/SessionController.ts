import { Request, Response } from 'express';
import {
  GetAllSessions,
  GetSessionById,
  FilterSessionsByTag,
  SearchSession,
  CreateSessionUseCase,
  UpdateSessionUseCase,
  DeleteSessionUseCase
} from '../../../application/useCases/session';
import { validateCreateSession, validateUpdateSession } from '../validators/sessionValidator';
import { ApplicationError } from '../../../shared/errors/ApplicationError';

export class SessionController {
  constructor(
    private readonly getAllSessionsUseCase: GetAllSessions,
    private readonly getSessionByIdUseCase: GetSessionById,
    private readonly getSessionsByTagsUseCase: FilterSessionsByTag,
    private readonly searchSessionsUseCase: SearchSession,
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly updateSessionUseCase: UpdateSessionUseCase,
    private readonly deleteSessionUseCase: DeleteSessionUseCase
  ) {}

  async getAllSessions(req: Request, res: Response): Promise<Response> {
    try {
      const sessions = await this.getAllSessionsUseCase.execute();
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSessionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const session = await this.getSessionByIdUseCase.execute(id);
      return res.status(200).json(session);
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('Error fetching session by ID:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSessionsByTags(req: Request, res: Response): Promise<Response> {
    try {
      const { tags } = req.query;
      const tagArray = (Array.isArray(tags) ? tags : [tags]).map(tag => String(tag));
      const sessions = await this.getSessionsByTagsUseCase.execute(tagArray);
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching sessions by tags:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async searchSessions(req: Request, res: Response): Promise<Response> {
    try {
      const { term } = req.query;
      if (!term || typeof term !== 'string') {
        return res.status(400).json({ message: 'Search term is required' });
      }
      
      const sessions = await this.searchSessionsUseCase.execute(term);
      return res.status(200).json(sessions);
    } catch (error) {
      console.error('Error searching sessions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createSession(req: Request, res: Response): Promise<Response> {
    try {
      const sessionData = req.body;
      console.log('📝 Creating session with data:', JSON.stringify(sessionData, null, 2));
      
      const { error, value } = validateCreateSession(sessionData);
      
      if (error) {
        console.error('❌ Validation error:', error.message);
        console.error('❌ Validation details:', error.details);
        return res.status(400).json({ 
          message: error.message,
          details: error.details 
        });
      }
      
      const session = await this.createSessionUseCase.execute(value);
      console.log('✅ Session created successfully:', session.id);
      return res.status(201).json(session);
    } catch (error) {
      console.error('💥 Error creating session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateSession(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const sessionData = req.body;
      
      const { error, value } = validateUpdateSession(sessionData);
      
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      
      const session = await this.updateSessionUseCase.execute(id, value);
      return res.status(200).json(session);
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('Error updating session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteSession(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteSessionUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof ApplicationError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('Error deleting session:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
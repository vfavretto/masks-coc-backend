import { Session, Clue, Item } from '../../../domain/entities/Session';
import { SessionRepository } from '../../../domain/repositories/SessionRepository';
import { SessionModel, SessionDocument } from '../models/SessionModel';

export class MongoSessionRepository implements SessionRepository {
  private documentToEntity(doc: SessionDocument): Session {
    return {
      id: doc.id.toString(),
      title: doc.title,
      date: doc.date,
      location: doc.location,
      summary: doc.summary,
      details: doc.details,
      tags: doc.tags,
      images: doc.images,
      clues: doc.clues.map(clue => ({
        id: clue.id.toString(),
        name: clue.name,
        description: clue.description,
        type: clue.type,
        image: clue.image,
        tag: clue.tag,
        location: clue.location
      })),
      items: doc.items.map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        type: item.type
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async findAll(): Promise<Session[]> {
    const sessions = await SessionModel.find().sort({ date: -1 }).lean();
    return sessions.map(session => this.documentToEntity(session as SessionDocument));
  }

  async findById(id: string): Promise<Session | null> {
    const session = await SessionModel.findById(id);
    return session ? this.documentToEntity(session) : null;
  }

  async findByTags(tags: string[]): Promise<Session[]> {
    const sessions = await SessionModel.find({ tags: { $in: tags } }).sort({ date: -1 }).lean();
    return sessions.map(session => this.documentToEntity(session as SessionDocument));
  }

  async search(term: string): Promise<Session[]> {
    const sessions = await SessionModel.find(
      { $text: { $search: term } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).lean();
    
    return sessions.map(session => this.documentToEntity(session as SessionDocument));
  }

  async create(sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    const newSession = await SessionModel.create(sessionData);
    return this.documentToEntity(newSession);
  }

  async update(id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Session | null> {
    const updatedSession = await SessionModel.findByIdAndUpdate(
      id,
      { $set: sessionData },
      { new: true }
    );
    return updatedSession ? this.documentToEntity(updatedSession) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await SessionModel.findByIdAndDelete(id);
    return !!result;
  }
}

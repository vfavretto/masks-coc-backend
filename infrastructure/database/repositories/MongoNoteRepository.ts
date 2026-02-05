import { NoteRepository } from '../../../domain/repositories/NoteRepository';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '../../../domain/entities/Note';
import { NoteModel, NoteDocument } from '../models/NoteModel';

const toNote = (doc: NoteDocument): Note => ({
  id: (doc._id as any).toString(),
  title: doc.title,
  content: doc.content,
  userId: doc.userId.toString(),
  visibility: doc.visibility,
  tags: doc.tags || [],
  linkedSessionId: doc.linkedSessionId?.toString(),
  linkedCharacterId: doc.linkedCharacterId?.toString(),
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoNoteRepository implements NoteRepository {
  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id);
    return doc ? toNote(doc) : null;
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const docs = await NoteModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(toNote);
  }

  async findPublic(): Promise<Note[]> {
    const docs = await NoteModel.find({ visibility: 'public' }).sort({ createdAt: -1 });
    return docs.map(toNote);
  }

  async findBySessionId(sessionId: string): Promise<Note[]> {
    const docs = await NoteModel.find({ linkedSessionId: sessionId }).sort({ createdAt: -1 });
    return docs.map(toNote);
  }

  async findByCharacterId(characterId: string): Promise<Note[]> {
    const docs = await NoteModel.find({ linkedCharacterId: characterId }).sort({ createdAt: -1 });
    return docs.map(toNote);
  }

  async create(userId: string, noteData: CreateNoteDTO): Promise<Note> {
    const doc = await NoteModel.create({
      ...noteData,
      userId,
      visibility: noteData.visibility || 'private',
      tags: noteData.tags || [],
    });
    return toNote(doc);
  }

  async update(id: string, noteData: UpdateNoteDTO): Promise<Note | null> {
    const doc = await NoteModel.findByIdAndUpdate(id, noteData, { new: true });
    return doc ? toNote(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.findByIdAndDelete(id);
    return !!result;
  }
}

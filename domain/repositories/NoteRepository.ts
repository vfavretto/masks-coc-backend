import { Note, CreateNoteDTO, UpdateNoteDTO } from '../entities/Note';

export interface NoteRepository {
  findById(id: string): Promise<Note | null>;
  findByUserId(userId: string): Promise<Note[]>;
  findPublic(): Promise<Note[]>;
  findBySessionId(sessionId: string): Promise<Note[]>;
  findByCharacterId(characterId: string): Promise<Note[]>;
  create(userId: string, noteData: CreateNoteDTO): Promise<Note>;
  update(id: string, noteData: UpdateNoteDTO): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
}

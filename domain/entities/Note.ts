export type NoteVisibility = 'private' | 'public';

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  visibility: NoteVisibility;
  tags: string[];
  linkedSessionId?: string;
  linkedCharacterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  visibility?: NoteVisibility;
  tags?: string[];
  linkedSessionId?: string;
  linkedCharacterId?: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
  visibility?: NoteVisibility;
  tags?: string[];
  linkedSessionId?: string;
  linkedCharacterId?: string;
}

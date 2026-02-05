import { Request, Response } from 'express';
import { MongoNoteRepository } from '../../database/repositories/MongoNoteRepository';

const noteRepository = new MongoNoteRepository();

export class NoteController {
  static async getMyNotes(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const notes = await noteRepository.findByUserId(req.user.userId);
      res.json(notes);
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPublicNotes(req: Request, res: Response): Promise<void> {
    try {
      const notes = await noteRepository.findPublic();
      res.json(notes);
    } catch (error) {
      console.error('Get public notes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getNoteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const note = await noteRepository.findById(id);

      if (!note) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      // Check access: owner or public note
      if (note.visibility === 'private' && note.userId !== req.user?.userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      res.json(note);
    } catch (error) {
      console.error('Get note error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { title, content, visibility, tags, linkedSessionId, linkedCharacterId } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      const note = await noteRepository.create(req.user.userId, {
        title,
        content,
        visibility,
        tags,
        linkedSessionId,
        linkedCharacterId,
      });

      res.status(201).json(note);
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const existingNote = await noteRepository.findById(id);

      if (!existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      // Only owner can update
      if (existingNote.userId !== req.user.userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const note = await noteRepository.update(id, req.body);
      res.json(note);
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const existingNote = await noteRepository.findById(id);

      if (!existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }

      // Only owner or keeper can delete
      if (existingNote.userId !== req.user.userId && req.user.role !== 'keeper') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      await noteRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

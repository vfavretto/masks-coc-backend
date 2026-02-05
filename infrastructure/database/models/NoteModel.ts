import mongoose, { Schema, Document } from 'mongoose';
import { Note, NoteVisibility } from '../../../domain/entities/Note';

export interface NoteDocument extends Omit<Note, 'id'>, Document {}

const NoteSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  visibility: { 
    type: String, 
    enum: ['private', 'public'] as NoteVisibility[],
    default: 'private',
    required: true
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  linkedSessionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Session',
    required: false
  },
  linkedCharacterId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Character',
    required: false
  },
}, { timestamps: true });

NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ visibility: 1 });
NoteSchema.index({ tags: 1 });

export const NoteModel = mongoose.model<NoteDocument>('Note', NoteSchema);

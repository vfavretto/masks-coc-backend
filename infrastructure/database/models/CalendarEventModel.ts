import mongoose, { Schema, Document } from 'mongoose';
import { CalendarEvent, EventType, EventVisibility } from '../../../domain/entities/CalendarEvent';

export interface CalendarEventDocument extends Omit<CalendarEvent, 'id'>, Document {}

const CalendarEventSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String,
    trim: true
  },
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  endDate: { 
    type: Date
  },
  type: { 
    type: String, 
    enum: ['session', 'reminder', 'milestone', 'other'] as EventType[],
    default: 'other',
    required: true
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  visibility: { 
    type: String, 
    enum: ['private', 'public'] as EventVisibility[],
    default: 'public',
    required: true
  },
  color: { 
    type: String,
    default: '#c9a55c' // Primary gold color
  },
}, { timestamps: true });

CalendarEventSchema.index({ date: 1, visibility: 1 });
CalendarEventSchema.index({ createdBy: 1, date: 1 });

export const CalendarEventModel = mongoose.model<CalendarEventDocument>('CalendarEvent', CalendarEventSchema);

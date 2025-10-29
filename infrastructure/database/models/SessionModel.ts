import mongoose, { Schema, Document } from 'mongoose';
import { Session } from '../../../domain/entities/Session';

export interface SessionDocument extends Omit<Session, 'id'>, Document {}

const ClueSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    image: {type: String, required: false},
    tag: {type: String, required: false},
    location: {type: String, required: false},
}, {_id: true});

const ItemSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
}, {_id: true});

const SessionSchema = new Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    summary: {type: String, required: true},
    details: {type: String, required: true},
    tags: [{type: String}],
    images: [{type: String}],
    clues: [ClueSchema],
    items: [ItemSchema], 
}, {timestamps: true});

// Text index for full-text search
SessionSchema.index({title: 'text', summary: 'text', details: 'text', location: 'text'});

// Index on tags for faster filtering by tags
SessionSchema.index({tags: 1});

// Index on date for faster sorting
SessionSchema.index({date: -1});

export const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema);
import mongoose, { Schema, Document } from 'mongoose';
import { Session } from '../../../domain/entities/Session';

export interface SessionDocument extends Omit<Session, 'id'>, Document {}

const ClueSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
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

SessionSchema.index({title: 'text', summary: 'text', details: 'text', location: 'text'});

export const SessionModel = mongoose.model<SessionDocument>('Session', SessionSchema);
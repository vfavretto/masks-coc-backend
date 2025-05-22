import mongoose, { Schema, Document } from 'mongoose';
import { Character } from '../../../domain/entities/Character';

export interface CharacterDocument extends Omit<Character, 'id'>, Document {}

const StatsSchema = new Schema({
    For: {type: Number, required: true},
    Con: {type: Number, required: true},
    Tam: {type: Number, required: true},
    Des: {type: Number, required: true},
    Apa: {type: Number, required: true},
    Edu: {type: Number, required: true},
    Int: {type: Number, required: true},
    Pod: {type: Number, required: true},
}, {_id: false});

const MentalHealthSchema = new Schema({
    sanity: {type: Number, required: true},
    maxSanity: {type: Number, required: true},
    temporaryInSanity: {type: Boolean, default: false},
    indefiniteInSanity: {type: Boolean, default: false},
    phobias: [{type: String}],
    manias: [{type: String}],
}, {_id: false});

const SkillsSchema = new Schema({
    name: {type: String, required: true},
    value: {type: Number, required: true},
    category: {type: String, enum: ['combat', 'academic', 'pratical', 'social'], required: true},
}, {_id: true});

const EquipmentSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, enum: ['weapon', 'tool', 'book', 'artifact'], required: true},
    description: {type: String, required: true},
}, {_id: true});

const CharacterSchema = new Schema({
    name: {type: String, required: true},
    occupation: {type: String, required: true},
    image: {type: String, required: true},
    stats: {type: StatsSchema, required: true},
    background: {type: String, required: true},
    mentalHealth: {type: MentalHealthSchema, required: true},
    skills: [SkillsSchema],
    equipment: [EquipmentSchema],
    pulpTalents: [{type: String}],
    wounds: {type: Number, required: true},
    maxHealth: {type: Number, required: true},
    
}, {timestamps: true});

CharacterSchema.index({ name: 'text', occupation: 'text', background: 'text' });

export const CharacterModel = mongoose.model<CharacterDocument>('Character', CharacterSchema);
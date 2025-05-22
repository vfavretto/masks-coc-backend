import Joi from 'joi';
import { Character, Stats, MentalHealth, Skill, Equipment } from '../../../domain/entities/Character';

const statsSchema = Joi.object<Stats>({
  For: Joi.number().required(),
  Con: Joi.number().required(),
  Tam: Joi.number().required(),
  Des: Joi.number().required(),
  Apa: Joi.number().required(),
  Edu: Joi.number().required(),
  Int: Joi.number().required(),
  Pod: Joi.number().required(),
});

const mentalHealthSchema = Joi.object<MentalHealth>({
  sanity: Joi.number().required(),
  maxSanity: Joi.number().required(),
  tempSanity: Joi.boolean().default(false),
  indefiniteSanity: Joi.boolean().default(false),
  phobias: Joi.array().items(Joi.string()).default([]),
  manias: Joi.array().items(Joi.string()).default([]),
});

const skillSchema = Joi.object<Skill>({
  name: Joi.string().required(),
  value: Joi.number().required(),
  category: Joi.string().valid('combat', 'academic', 'pratical', 'social').required(),
});

const equipmentSchema = Joi.object<Equipment>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('weapon', 'tool', 'book', 'artifact').required(),
});

const createCharacterSchema = Joi.object<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  image: Joi.string().required(),
  stats: statsSchema.required(),
  background: Joi.string().required(),
  mentalHealth: mentalHealthSchema.required(),
  skills: Joi.array().items(skillSchema).default([]),
  equipment: Joi.array().items(equipmentSchema).default([]),
  pulpTalents: Joi.array().items(Joi.string()).default([]),
  wounds: Joi.number().required(),
  maxHealth: Joi.number().required(),
});

const updateCharacterSchema = Joi.object<Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>>({
  name: Joi.string(),
  occupation: Joi.string(),
  image: Joi.string(),
  stats: statsSchema,
  background: Joi.string(),
  mentalHealth: mentalHealthSchema,
  skills: Joi.array().items(skillSchema),
  equipment: Joi.array().items(equipmentSchema),
  pulpTalents: Joi.array().items(Joi.string()),
  wounds: Joi.number(),
  maxHealth: Joi.number(),
});

export const validateCreateCharacter = (data: any) => {
  return createCharacterSchema.validate(data, { abortEarly: false });
};

export const validateUpdateCharacter = (data: any) => {
  return updateCharacterSchema.validate(data, { abortEarly: false });
};
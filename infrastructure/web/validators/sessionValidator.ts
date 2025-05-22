import Joi from 'joi';
import { Session, Clue, Item } from '../../../domain/entities/Session';

const clueSchema = Joi.object<Omit<Clue, 'id'>>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
});

const itemSchema = Joi.object<Omit<Item, 'id'>>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
});

const createSessionSchema = Joi.object<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>({
  title: Joi.string().required(),
  date: Joi.string().required(), // date is passed as an ISO string?
  location: Joi.string().required(),
  summary: Joi.string().required(),
  details: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  clues: Joi.array().items(clueSchema).default([]),
  items: Joi.array().items(itemSchema).default([]),
});

const updateSessionSchema = Joi.object<Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>>({
  title: Joi.string(),
  date: Joi.string(), //date is passed as an ISO string?
  location: Joi.string(),
  summary: Joi.string(),
  details: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  clues: Joi.array().items(clueSchema),
  items: Joi.array().items(itemSchema),
});

export const validateCreateSession = (data: any) => {
  return createSessionSchema.validate(data, { abortEarly: false });
};

export const validateUpdateSession = (data: any) => {
  return updateSessionSchema.validate(data, { abortEarly: false });
};
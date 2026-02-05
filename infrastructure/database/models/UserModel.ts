import mongoose, { Schema, Document } from 'mongoose';
import { User, UserRole } from '../../../domain/entities/User';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const UserSettingsSchema = new Schema({
  emailNotifications: { type: Boolean, default: true },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
}, { _id: false });

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['keeper', 'player'] as UserRole[],
    default: 'player',
    required: true
  },
  characterId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Character',
    required: false
  },
  // Profile fields
  displayName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  avatar: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  settings: {
    type: UserSettingsSchema,
    default: () => ({})
  },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

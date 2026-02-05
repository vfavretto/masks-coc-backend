import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel, UserDocument } from '../models/UserModel';

const toUser = (doc: UserDocument): User => ({
  id: (doc._id as any).toString(),
  username: doc.username,
  email: doc.email,
  passwordHash: doc.passwordHash,
  role: doc.role,
  characterId: doc.characterId?.toString(),
  displayName: doc.displayName,
  avatar: doc.avatar,
  bio: doc.bio,
  settings: doc.settings,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? toUser(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? toUser(doc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username });
    return doc ? toUser(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find();
    return docs.map(toUser);
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const doc = await UserModel.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });
    return toUser(doc);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, userData, { new: true });
    return doc ? toUser(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}

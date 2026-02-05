import { Request, Response } from 'express';
import { MongoUserRepository } from '../../database/repositories/MongoUserRepository';
import { toUserPublic, UpdateProfileDTO } from '../../../domain/entities/User';

const userRepository = new MongoUserRepository();

export class ProfileController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await userRepository.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(toUserPublic(user));
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { displayName, avatar, bio, characterId, settings } = req.body as UpdateProfileDTO;

      // Validate displayName length
      if (displayName && displayName.length > 100) {
        res.status(400).json({ error: 'Display name too long (max 100 characters)' });
        return;
      }

      // Validate bio length
      if (bio && bio.length > 500) {
        res.status(400).json({ error: 'Bio too long (max 500 characters)' });
        return;
      }

      const updateData: Partial<UpdateProfileDTO> = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (bio !== undefined) updateData.bio = bio;
      if (characterId !== undefined) updateData.characterId = characterId;
      if (settings !== undefined) updateData.settings = settings;

      const user = await userRepository.update(req.user.userId, updateData as any);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(toUserPublic(user));
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Return limited public info
      res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      });
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

import { Request, Response } from 'express';
import { RegisterUser } from '../../../application/useCases/RegisterUser';
import { LoginUser } from '../../../application/useCases/LoginUser';
import { GetCurrentUser } from '../../../application/useCases/GetCurrentUser';
import { MongoUserRepository } from '../../database/repositories/MongoUserRepository';

const userRepository = new MongoUserRepository();

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role, characterId } = req.body;

      // Only keeper can register new users with keeper role
      if (role === 'keeper' && req.user?.role !== 'keeper') {
        res.status(403).json({ error: 'Only keepers can create other keepers' });
        return;
      }

      const registerUser = new RegisterUser(userRepository);
      const result = await registerUser.execute({ username, email, password, role, characterId });

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json(result.user);
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const loginUser = new LoginUser(userRepository);
      const result = await loginUser.execute({ email, password });

      if (!result.success) {
        res.status(401).json({ error: result.error });
        return;
      }

      res.json({
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const getCurrentUser = new GetCurrentUser(userRepository);
      const result = await getCurrentUser.execute(req.user.userId);

      if (!result.success) {
        res.status(404).json({ error: result.error });
        return;
      }

      res.json(result.user);
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userRepository.findAll();
      const publicUsers = users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        characterId: u.characterId,
      }));
      res.json(publicUsers);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

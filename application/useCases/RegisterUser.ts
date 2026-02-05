import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, CreateUserDTO, toUserPublic, UserPublic } from '../../domain/entities/User';
import { PasswordService } from '../../shared/services/PasswordService';

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  role?: 'keeper' | 'player';
  characterId?: string;
}

interface RegisterUserResult {
  success: boolean;
  user?: UserPublic;
  error?: string;
}

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    // Validate input
    if (!input.username || input.username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }

    if (!input.email || !input.email.includes('@')) {
      return { success: false, error: 'Invalid email address' };
    }

    if (!input.password || input.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) {
      return { success: false, error: 'Email already registered' };
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(input.username);
    if (existingUsername) {
      return { success: false, error: 'Username already taken' };
    }

    // Hash password
    const passwordHash = await PasswordService.hash(input.password);

    // Create user
    const user = await this.userRepository.create({
      username: input.username,
      email: input.email,
      passwordHash,
      role: input.role || 'player',
      characterId: input.characterId,
    });

    return { success: true, user: toUserPublic(user) };
  }
}

import { UserRepository } from '../../domain/repositories/UserRepository';
import { toUserPublic, UserPublic } from '../../domain/entities/User';
import { PasswordService } from '../../shared/services/PasswordService';
import { JwtService } from '../../shared/services/JwtService';

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginUserResult {
  success: boolean;
  token?: string;
  user?: UserPublic;
  error?: string;
}

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    // Validate input
    if (!input.email || !input.password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValidPassword = await PasswordService.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate JWT
    const token = JwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      token,
      user: toUserPublic(user),
    };
  }
}

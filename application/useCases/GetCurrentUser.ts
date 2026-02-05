import { UserRepository } from '../../domain/repositories/UserRepository';
import { toUserPublic, UserPublic } from '../../domain/entities/User';

interface GetCurrentUserResult {
  success: boolean;
  user?: UserPublic;
  error?: string;
}

export class GetCurrentUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetCurrentUserResult> {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: toUserPublic(user),
    };
  }
}

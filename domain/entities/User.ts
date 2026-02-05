export type UserRole = 'keeper' | 'player';

export interface UserSettings {
  emailNotifications: boolean;
  theme: 'dark' | 'light';
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  characterId?: string;
  // Profile fields
  displayName?: string;
  avatar?: string;
  bio?: string;
  settings?: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  characterId?: string;
}

export interface UpdateProfileDTO {
  displayName?: string;
  avatar?: string;
  bio?: string;
  characterId?: string;
  settings?: Partial<UserSettings>;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  characterId?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  settings?: UserSettings;
}

export const toUserPublic = (user: User): UserPublic => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  characterId: user.characterId,
  displayName: user.displayName,
  avatar: user.avatar,
  bio: user.bio,
  settings: user.settings,
});

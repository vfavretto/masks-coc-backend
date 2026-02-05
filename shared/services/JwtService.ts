import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'keeper' | 'player';
}

export const JwtService = {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  },

  decode(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  },
};

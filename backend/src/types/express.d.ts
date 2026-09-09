import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { sub: string; usuario: string; rol: string };
    }
  }
}

export {};

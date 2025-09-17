import { MyJwtPayload } from './jwt';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
      } | JwtPayload;
    }
  }
}
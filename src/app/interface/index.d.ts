import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;  // optional রাখা ভালো
    }
  }
}

export {};

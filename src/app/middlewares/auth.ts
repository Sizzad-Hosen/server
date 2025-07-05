import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../config/error/AppError';
import config from '../config';

import { kMaxLength } from 'buffer';
import { User } from '../../modules/Users/user.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}


const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
    
      if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Authorization header missing or invalid');
      }

      const token = authHeader.split(' ')[1];

      if (!config.jwt_access_secret) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT secret is not configured!');
      }

      const decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;

      if (!decoded?.userId || !decoded?.role) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
      }
    
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found ree?????');
      }

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized for this action!');
      }

      req.user = decoded;

      next();

    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new AppError(httpStatus.UNAUTHORIZED, 'Token expired!'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or malformed token!'));
      } else {
        next(error);
      }
    }
  };
};

export default auth;
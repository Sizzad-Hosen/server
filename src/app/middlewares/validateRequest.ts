

import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body:req.body,
        cookies: req.cookies,
      });
      next();
    } catch (error: any) {

      const formattedErrors = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errorSources: formattedErrors, // ✅ no extra brackets
        stack: null,
      });
    }
  };
};

export default validateRequest;

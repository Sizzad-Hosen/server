
import config from '../config/index'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import handleZodError from '../config/error/handleZodError';
import handleValidationError from '../config/error/handleValidationError';
import handleCastError from '../config/error/handleCastError';
import AppError from '../config/error/AppError';
import handleDuplicateError from '../config/error/handleDublicateError';


const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500; 
  let message = err.message || 'Something went wrong';


  let errorSources: TErrorSources[] = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];



  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [simplifiedError?.errorSources];
  }
  else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [simplifiedError?.errorSources];
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [simplifiedError?.errorSources];
  }

  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = [simplifiedError?.errorSources];
  }  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack:config.NODE_ENV === 'development ' ? err?.stack : null
  });
};

export default globalErrorHandler;
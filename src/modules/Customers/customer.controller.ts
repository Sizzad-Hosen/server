import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { CustomerServices } from './customer.service';
import AppError from '../../app/config/error/AppError';

export const createCustomerController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const payload = req.body;

    const customer = await CustomerServices.createOrUpdateCustomer(payload, userId,req.file);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Customer created or updated successfully',
      data: customer,
    });
  }
);

export const updateCustomerController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;

    const updatedCustomer = await CustomerServices.updateCustomer(id, payload,req.file);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer,
    });
  }
);


export const getSingleCustomerController = catchAsync(

  async (req: Request, res: Response) => {

    const userId = req?.user?.userId
    
console.log("userId", userId)

if (!userId) {
  console.error('No userId found in req.user');

  throw new AppError('Unauthorized access', httpStatus.UNAUTHORIZED);
}

    console.log('Fetching customer with ID:', userId);

    const customer = await CustomerServices.getSingleCustomerByUserId(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer fetched successfully',
      data: customer,
    });
  }
);

export const CustomerControllers = {
  createCustomerController,
  updateCustomerController,
  getSingleCustomerController,
};
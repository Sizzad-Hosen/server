import { Request, Response } from 'express';
import httpStatus from 'http-status';

import * as CustomerService from './customer.service';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

export const createCustomerController = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.userId;

    const result = await CustomerService.createCustomer(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Customer created successfully',
      data: result,
    });
  }
);


export const updateCustomerController = catchAsync(
    
  async (req: Request, res: Response) => {
        const id = req.params.id;
        console.log("id", id)

        console.log("body", req.body)

       const result = await CustomerService.updateCustomer(id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Customer updated successfully',
      data: result,
    });
  }
);
export const getSingelCustomerController = catchAsync(

  async (req: Request, res: Response) => {

        const id = req.params.id;

        console.log("id", id)

     

       const result = await CustomerService.getSingelCustomer(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Customer updated successfully',
      data: result,
    });
  }
);

export const CustomerControllers = {
    createCustomerController,
    updateCustomerController,
    getSingelCustomerController
}
import { Request, Response } from 'express';
import { CustomBazerOrderServices } from './CustomBazerOrder.service';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';

export const createOrderController = catchAsync(async (req: Request, res: Response) => {

    const userId = req?.user?.userId
const result = await CustomBazerOrderServices.createOrderService(userId ,req.body);

sendResponse(res, {
statusCode: httpStatus.CREATED,
success: true,
message: 'Order created successfully',
data: result,
});
});


export const getOrdersController = catchAsync(async (req: Request, res: Response) => {
  console.log("query", req.query)
  const result = await CustomBazerOrderServices.getOrdersService(req.query);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: {
         data:result.data,
         meta:result.meta
    }

  });
});

export const getSingleOrderController = catchAsync(async (req: Request, res: Response) => {
const { id } = req.params;
const result = await CustomBazerOrderServices.getSingleOrderService(id);

if (!result) {
return sendResponse(res, {
statusCode: httpStatus.NOT_FOUND,
success: false,
message: 'Order not found',
data: null,
});
}

sendResponse(res, {
statusCode: httpStatus.OK,
success: true,
message: 'Order retrieved successfully',
data: result,
});
});


export const updateOrderStatusController = catchAsync(async (req: Request, res: Response) => {
  
  const { invoiceId } = req.params;

  const { status } = req.body;

  const updatedOrder = await CustomBazerOrderServices.updateOrderStatus(invoiceId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder,
  });
});


export const CustomBazerOrderControllers = {
createOrderController,
getOrdersController,
getSingleOrderController,
updateOrderStatusController
};
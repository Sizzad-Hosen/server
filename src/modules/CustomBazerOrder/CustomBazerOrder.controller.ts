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
  const role = (req as any).user?.role || 'user';     // From auth middleware
  const userId = (req as any).user?.userId;              // From auth middleware

  console.log("query", req.query);

  const result = await CustomBazerOrderServices.getOrdersService(req.query, role, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: {
      data: result.data,
      meta: result.meta,
    },
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

export const getAllCustomOrdersByUserIdControllers = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.userId;

    console.log("userId", userId)


    const orders = await CustomBazerOrderServices.getAllCustomOrdersByUserId(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  }
);
export const handleDeleteSingleOrder = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("Deleting order with id:", id);

    const role = (req as any).user?.role || "user";

    const deleted = await CustomBazerOrderServices.deleteSingleOrderById(id, role);

    if (!deleted) {
      console.log("Order not found for id:", id);
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: role === "admin" ? "Order permanently deleted" : "Order removed from your history",
      data: deleted,
    });
  }
);
export const updateCustomOrderPaymentController = catchAsync(async (req: Request, res: Response) => {

  const { invoiceId } = req.params;

  const { status } = req.body;

  if (!status) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Order status is required',
    });
  }

  const updatedCustomOrder = await CustomBazerOrderServices.updateCustomOrderPaymentStatus(invoiceId, status);

  if (!updatedCustomOrder) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Order updated not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Payment status updated successfully',
    data: updatedCustomOrder,
  });
});



export const trackCustomBazarOrder = catchAsync(async (req: Request, res: Response) => {

  const { invoiceId } = req.params;
console.log("Tracking order with invoiceId:", invoiceId);
  if (!invoiceId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Invoice number is required',
    });
  }

  const order = await CustomBazerOrderServices.getCustomBazarOrderByInvoice(invoiceId);

  if (!order) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'CustomBazar Order not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Track your order fetched successfully',
    data: order,
  });
});
export const CustomBazerOrderControllers = {
  trackCustomBazarOrder
  ,
createOrderController,
getOrdersController,
getSingleOrderController,
updateOrderStatusController,
getAllCustomOrdersByUserIdControllers,
handleDeleteSingleOrder,
updateCustomOrderPaymentController
};
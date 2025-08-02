
import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import { OrderServices } from "./order.service";


export const createOrderHandler = catchAsync(async (req: Request, res: Response) => {


  const userId = req?.user?.userId;

  if (!userId) throw new Error("Unauthorized");

  const result = await OrderServices.createOrder(req.body, userId);

  if ("paymentUrl" in result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redirecting to SSLCommerz...",
      data: { url: result.paymentUrl },
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Order placed successfully with Cash on Delivery",
      data: result,
    });
  }
});



export const trackOrder = catchAsync(async (req: Request, res: Response) => {
  const { invoiceNumber } = req.params;

  if (!invoiceNumber) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Invoice number is required',
    });
  }

  const order = await OrderServices.getOrderByInvoice(invoiceNumber);

  if (!order) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Order not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Track your order fetched successfully',
    data: order,
  });
});



export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { invoiceNumber } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Order status is required',
    });
  }

  const updatedOrder = await OrderServices.updateOrderStatus(invoiceNumber, status);

  if (!updatedOrder) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Order not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder,
  });
});

export const OrderControllers = { createOrderHandler, trackOrder , updateOrderStatus};


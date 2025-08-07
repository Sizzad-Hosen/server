
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

  const { invoiceId } = req.params;

  if (!invoiceId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Invoice number is required',
    });
  }

  const order = await OrderServices.getOrderByInvoice(invoiceId);

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


export const getOrdersController = catchAsync(async (req: Request, res: Response) => {


  const role = (req as any).user?.role || 'user';


  const userId = (req as any).user?.userId;

  const result = await OrderServices.getAllOrders(req.query, role, userId);

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


export const getSingelOrder = catchAsync(async (req: Request, res: Response) => {

  const { invoiceId} = req.params;
  const updatedOrder = await OrderServices.getOrderByInvoice(invoiceId);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order  retried successfully',
    data: updatedOrder,
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { invoiceId} = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Order status is required',
    });
  }

  const updatedOrder = await OrderServices.updateOrderStatus(invoiceId, status);

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

export const updateOrderPaymentStatus = catchAsync(async (req: Request, res: Response) => {

  const { invoiceId } = req.params;

  const { status } = req.body;

  if (!status) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Order status is required',
    });
  }

  const updatedOrder = await OrderServices.updateOrderStatus(invoiceId, status);

  if (!updatedOrder) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Order updated not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Payment status updated successfully',
    data: updatedOrder,
  });
});


export const getAllOrdersByUserIdControllers = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.userId;

    console.log("userId", userId)

    const orders = await OrderServices.getAllOrdersByUserId(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  }
);



export const handleDeleteSingleOrder = catchAsync(async (req: Request, res: Response) => {

 const id = req.params.id;
console.log("deleted id", id)
 
    const role = (req as any).user?.role || "user"; 

    const deleted = await OrderServices.deleteSingleOrderById(id, role);

    if (!deleted) {
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
  })


export const OrderControllers = { createOrderHandler,handleDeleteSingleOrder, getAllOrdersByUserIdControllers,getSingelOrder, trackOrder , updateOrderStatus , getOrdersController , updateOrderPaymentStatus};


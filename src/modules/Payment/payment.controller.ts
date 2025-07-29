
// ============================== Payment Controller ==============================
import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import { PaymentServices } from "./payment.service";
import { OrderModel } from "../Orders/order.model";

const createPaymentHandler = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const userId = req?.user?.userId;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Order not found.",
      data: null,
    });
  }

  const method = order.paymentMethod?.toLowerCase();

  if (method === "cash_on_delivery") {
    const result = await PaymentServices.createCodPayment(orderId, userId);
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash on Delivery payment confirmed.",
      data: result,
    });
  } else if (method === "sslcommerz") {
    const result = await PaymentServices.createSslPayment(orderId, userId);
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redirecting to SSLCommerz Gateway.",
      data: result,
    });
  } else {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid payment method in order. Use 'cash_on_delivery' or 'sslcommerz'.",
      data: null,
    });
  }
});

const sslPaymentSuccessHandler = catchAsync(async (req: Request, res: Response) => {
  await PaymentServices.confirmSslPayment(req.body);
  res.redirect(`${process.env.CLIENT_SUCCESS_URL}?tran_id=${req.body.tran_id}`);
});

const sslPaymentFailedHandler = catchAsync(async (req: Request, res: Response) => {
  await PaymentServices.failSslPayment(req.params.tran_id);
  res.redirect(`${process.env.CLIENT_FAILED_URL}`);
});

export const PaymentController = {
  createPaymentHandler,
  sslPaymentSuccessHandler,
  sslPaymentFailedHandler,
};
import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import HttpStatus from "http-status";
import { OrderServices } from "./order.service";

export const createOrderHandler = catchAsync(async (req: Request, res: Response) => {
  
  const userId = req?.user?.userId;
  

  console.log("userId", userId)

  if (!userId) throw new Error("Unauthorized");

  console.log("body", req.body);
  

  const result = await OrderServices.createOrder(req.body, userId);

  if ("paymentUrl" in result) {
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Redirecting to SSLCommerz...",
      data: { url: result.paymentUrl },
    });
  } else {
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "Order placed successfully with Cash on Delivery",
      data: result,
    });
  }
});

export const OrderControllers = {
  createOrderHandler,
};

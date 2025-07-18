import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import { OrderServices } from "./order.service";



// Step 2: Confirm Payment & Create Order after payment success
export const confirmOrderAfterPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { paymentId } = req.body;

  const order = await OrderServices.confirmOrderAfterPayment({ userId, paymentId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order placed successfully after payment confirmation",
    data: order,
  });
});

export const OrderControllers = {     
  confirmOrderAfterPayment
};

import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";

export const createPaymentHandler = async (req: Request, res: Response) => {
  try {
    const payment = await PaymentServices.createPayment(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed", error });
  }
};

export const confirmPaymentHandler = async (req: Request, res: Response) => {
  const { transactionId, status } = req.body;
  try {
    const updated = await PaymentServices.updatePaymentStatus(transactionId, status);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment update failed", error });
  }
};


export const PaymentControllers = {
    createPaymentHandler,
    confirmPaymentHandler
}
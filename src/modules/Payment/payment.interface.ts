import { Types } from "mongoose";

export type PaymentStatus = "pending" | "success" | "failed";

export type PaymentMethod = "cash-on-delivery" | "sslcommerz";

export type TPayment = {

  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  paidAt?: Date;

};

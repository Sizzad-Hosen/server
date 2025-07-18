import { Types } from "mongoose";

export interface TPayment {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  paymentMethod: "bkash" | "nagad" | "sslcommerz" | "cash_on_delivery";
  transactionId?: string;
  sslSessionKey?: string; // For SSLCommerz gateway session tracking
  gatewayResponse?: any;  // You may type this strictly later
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

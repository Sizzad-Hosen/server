import { Types } from "mongoose";

export type TOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type TPaymentMethod = "cash_on_delivery" | "sslcommerz";
export type TPaymentStatus = "pending" | "success" | "failed";


export type TOrder = {
  user: Types.ObjectId;
  cart: Types.ObjectId;
  invoiceId: string;
  totalPrice: number;
  orderStatus?: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus?: TPaymentStatus;
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;

  };
};

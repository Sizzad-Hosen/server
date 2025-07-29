import { Types } from "mongoose";

export type TOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type TPaymentMethod = "cash_on_delivery" | "sslcommerz";
export type TPaymentStatus = "pending" | "success" | "failed";

export type TOrder = {
  user: Types.ObjectId;
  cart: Types.ObjectId;
  invoiceNumber: string;
  totalPrice: number;
  orderStatus?: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus?: TPaymentStatus;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

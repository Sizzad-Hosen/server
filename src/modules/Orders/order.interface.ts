import { Types } from "mongoose";

export type TOrderStatus = "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type TPaymentMethod = "cash_on_delivery" | "sslcommerz";

export type TPaymentStatus = "pending" | "paid" | "success" | "failed";

export type TDeliveryOption = "insideRangpur" | "outsideRangpur";

export type TOrder = {
  user: Types.ObjectId;
  cart: Types.ObjectId;
  invoiceId: string;
  totalPrice: number;
  orderStatus?: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus?: TPaymentStatus;
  deliveryOption: TDeliveryOption;  // <-- added delivery option here
 siteNote?: string;
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;
  };
  deletedByUser?: boolean;
};

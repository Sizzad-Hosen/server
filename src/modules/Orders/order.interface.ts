import { Types } from "mongoose";

export type TOrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TPaymentMethod = "cash_on_delivery" | "sslcommerz";

export type TPaymentStatus = "pending" | "paid" | "success" | "failed";

export type TDeliveryOption = "insideRangpur" | "outsideRangpur";

export type TOrderItem = {
  productId: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image?: string;

};

export type TOrder = {
  user: Types.ObjectId;
  cart?: Types.ObjectId; // optional, so empty cart won't break
  items: TOrderItem[];   // <-- snapshot field added
  invoiceId: string;
  totalPrice: number;
  orderStatus?: TOrderStatus;
  paymentMethod: TPaymentMethod;
  paymentStatus?: TPaymentStatus;
  deliveryOption: TDeliveryOption;
  siteNote?: string;
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;
  };
  deletedByUser?: boolean;
};

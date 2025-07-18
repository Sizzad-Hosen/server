import { Types } from "mongoose";
import { TCartItem } from "../Cart/cart.interface";
import { TShippingAddress } from "../Address/address.interface";


export interface TOrder {
  userId: Types.ObjectId;
  items: TCartItem[];
  totalQuantity: number;
  totalPrice: number;
  invoiceNumber: number;
  shippingAddressId: Types.ObjectId;
  shippingAddress?: TShippingAddress;
  paymentId?: Types.ObjectId;
  paymentMethod: "bkash" | "nagad" | "sslcommerz" | "cash_on_delivery";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

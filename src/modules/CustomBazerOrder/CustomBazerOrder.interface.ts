// interfaces/order.interface.ts
import { Types } from 'mongoose';

export interface TCustomBazerOrderItem {
  product: Types.ObjectId;          // Ref to main product (e.g., Fruits)
  subcategoryName: string;          // e.g., "Apple" - must be in product.subcategories[]
  quantity: number;                 // e.g., 2 kg or 10 pieces
  unit: 'kg' | 'gm' | 'piece' | 'litre'; // match the subcategory unit
  pricePerUnit: number; 
  size?:string           // From subcategory
  totalPrice: number;              // quantity * pricePerUnit
}
export type TPaymentStatus = "pending" |"paid"| "success" | "failed";

export type TDeliveryOption = "insideRangpur" | "outsideRangpur";

export interface TCustomBazerOrder {
  user: Types.ObjectId;
  orderItems: TCustomBazerOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: 'sslcommerz' | 'cash_on_delivery';
  paymentStatus?: TPaymentStatus;
  address: {
    fullName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  deliveryOption: TDeliveryOption;
  invoiceId:string;
  siteNote?: string;
  deletedByUser?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

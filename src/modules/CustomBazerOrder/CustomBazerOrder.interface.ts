// interfaces/order.interface.ts
import { Types } from 'mongoose';

export interface TCustomBazerOrderItem {
  product: Types.ObjectId;          // Ref to main product (e.g., Fruits)
  subcategoryName: string;          // e.g., "Apple" - must be in product.subcategories[]
  quantity: number;                 // e.g., 2 kg or 10 pieces
  unit: 'kg' | 'gm' | 'piece' | 'litre'; // match the subcategory unit
  pricePerUnit: number;            // From subcategory
  totalPrice: number;              // quantity * pricePerUnit
}

export interface TCustomBazerOrder {
  user: Types.ObjectId;
  orderItems: TCustomBazerOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: 'sslcommerz' | 'cash_on_delivery';
  address: {
    fullName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  invoiceId:string;
  siteNote?: string;
  deletedByUser?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

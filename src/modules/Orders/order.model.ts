import { Schema, model, Types } from "mongoose";
import { TOrder } from "./order.interface";

const orderSchema = new Schema<TOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    invoiceNumber: { type: Number, required: true, unique: true },
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: "ShippingAddress",
      required: true,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "sslcommerz", "cash_on_delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = model<TOrder>("Order", orderSchema);

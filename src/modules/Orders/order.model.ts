import { Schema, model } from "mongoose";
import { TOrder } from "./order.interface";
import { optional } from "zod";

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: optional,
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: optional },
      },
    ],
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "sslcommerz"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "success", "failed"],
      default: "pending",
    },
    deliveryOption: {
      type: String,
      enum: ["insideRangpur", "outsideRangpur"],
      required: true,
      default: "insideRangpur",
    },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
      siteNote: {
      type: String,
      default: '',
    },
    deletedByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = model<TOrder>("Order", orderSchema);

import { Schema, model, Types } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "sslcommerz", "cash_on_delivery"],
      required: true,
    },
    transactionId: { type: String },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<TPayment>("Payment", paymentSchema);

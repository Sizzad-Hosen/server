import { Schema, model } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
    },

  method: {
  type: String,
  enum: ["cash_on_delivery", "sslcommerz"], 
  required: true,
},

    transactionId: {
      type: String,
      unique: true,
      sparse: true, // only required for sslcommerz
    },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<TPayment>("Payment", paymentSchema);

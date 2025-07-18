import { ShippingAddressModel } from "../Address/address.model";
import { Cart } from "../Cart/cart.model";
import { PaymentModel } from "../Payment/payment.model";
import { OrderModel } from "./order.model";
import { Error as MongooseError, Types } from "mongoose";

interface ConfirmOrderParams {
  userId: string;
  paymentId: string;
}

async function confirmOrderAfterPayment({
  userId,
  paymentId,
}: ConfirmOrderParams) {
  // 1. Find cart
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  // 2. Find shipping address
  const shippingAddress = await ShippingAddressModel.findOne({ userId });
  if (!shippingAddress) {
    throw new Error("No shipping address found.");
  }

  // 3. Check payment exists and is valid
  const payment = await PaymentModel.findById(paymentId);
  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (payment.paymentStatus !== "pending") {
    throw new Error("Payment already processed or invalid.");
  }

  // 4. Create order linked to paymentId
  const order = await OrderModel.create({
    userId,
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalPrice: cart.totalAmount,
    shippingAddressId: shippingAddress._id,
    paymentMethod: payment.paymentMethod, // use real method
    paymentId: payment._id,
    status: "pending",
  });

  // 5. Update payment with orderId and set status to completed
  await PaymentModel.findByIdAndUpdate(payment._id, {
    orderId: order._id,
    paymentStatus: "completed",
  });

  // 6. Clear cart
  await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [], totalAmount: 0, totalQuantity: 0 } }
  );

  return order;
}

export const OrderServices = {
  confirmOrderAfterPayment,
};

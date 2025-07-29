// src/modules/Payment/payment.service.ts

import { PaymentModel } from "./payment.model";
import { TPayment } from "./payment.interface";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import { OrderModel } from "../Orders/order.model";

export const createCodPayment = async (orderId: string, userId: string) => {
  
  const order = await OrderModel.findById(orderId);

  if (!order) throw new Error("Order not found");

  const codPayment = await PaymentModel.create({
    orderId: order._id,
    userId: order.user,
    amount: order.totalPrice,
    method: "cash_on_delivery",
    status: "success",
    paidAt: new Date(),
  });

  await OrderModel.findByIdAndUpdate(order._id, {
    paymentId: codPayment._id,
    orderStatus: "processing",
    paymentStatus: "paid",
  });

  return codPayment;
};

export const createSslPayment = async (orderId: string, userId: string) => {
  const order = await OrderModel.findOne({
    _id: orderId,
    user: userId,
    paymentStatus: "pending",
  });

  if (!order) throw new Error("Order not found");

  const tran_id = uuidv4();

  const sslcz = new SSLCommerzPayment(
    process.env.STORE_ID!,
    process.env.STORE_PASSWORD!,
    process.env.SSL_COMMERZ_MODE === "sandbox"
  );

  const data = {
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id,
    success_url: `${process.env.SERVER_URL}/api/payment/success/${tran_id}`,
    fail_url: `${process.env.SERVER_URL}/api/payment/fail/${tran_id}`,
    cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${tran_id}`,
    ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
    product_name: "Order Products",
    cus_name: "Customer",
    cus_email: "customer@example.com",
    cus_phone: "017XXXXXXXX",
    shipping_method: "Courier",
    product_profile: "general",
  };

  const response = await sslcz.init(data);

  await PaymentModel.create({
    orderId: order._id,
    userId: order.user,
    amount: order.totalPrice,
    method: "sslcommerz",
    status: "pending",
    transactionId: tran_id,
  });

  return { GatewayPageURL: response.GatewayPageURL };
};

export const confirmSslPayment = async (transactionData: any) => {
  const { tran_id } = transactionData;

  const payment = await PaymentModel.findOneAndUpdate(
    { transactionId: tran_id },
    { status: "success", paidAt: new Date() },
    { new: true }
  );

  if (!payment) throw new Error("Payment not found");

  await OrderModel.findByIdAndUpdate(payment.orderId, {
    paymentId: payment._id,
    orderStatus: "processing",
    paymentStatus: "paid",
  });

  return payment;
};

const failSslPayment = async (tran_id: string) => {
  await PaymentModel.findOneAndUpdate(
    { transactionId: tran_id },
    { status: "failed" }
  );
};

export const PaymentServices = {
  createCodPayment,
  createSslPayment,
  confirmSslPayment,
  failSslPayment,
};

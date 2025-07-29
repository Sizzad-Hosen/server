
// ============================== Payment Service ==============================
import { PaymentModel } from "./payment.model";
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

  const order = await OrderModel.findOne({ _id: orderId, user: userId, paymentStatus: "pending" }).populate("user");

  console.log("order for sllcommerce", order)
  if (!order) throw new Error("Order not found or already paid");

  const tran_id = uuidv4();

  const sslcz = new SSLCommerzPayment(
    process.env.STORE_ID!,
    process.env.STORE_PASSWORD!,
    process.env.SSL_COMMERZ_MODE === "sandbox"
  );

  console.log("sslcz",sslcz)
  const data = {
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id,
    success_url: `${process.env.SERVER_URL}/payments/success/${tran_id}`,
    fail_url: `${process.env.SERVER_URL}/payments/fail/${tran_id}`,
    cancel_url: `${process.env.SERVER_URL}/payments/cancel/${tran_id}`,
    ipn_url: `${process.env.SERVER_URL}/payments/ipn`,
    product_name: "Order Products",
    product_category: "Ecommerce",
    product_profile: "general",
    shipping_method: "Courier",
    cus_name: order.shippingAddress.fullName || "Customer",
    cus_email: order.user?.email || "customer@example.com",
    cus_add1: order.shippingAddress.address,
    cus_city: order.shippingAddress.city,
    cus_postcode: order.shippingAddress.postalCode,
    cus_country: order.shippingAddress.country || "Bangladesh",
    cus_phone: order.shippingAddress.phone,
    value_a: orderId,
    value_b: userId,
  };

console.log("data", data)

  const response = await sslcz.init(data);
  
  console.log("response", response)
  
  await PaymentModel.create({
    orderId: order._id,
    userId: order.user,
    amount: order.totalPrice,
    method: "sslcommerz",
    status: "pending",
    transactionId: tran_id,
  });
  
  console.log("gateway", response.GatewayPageURL)
  
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

export const failSslPayment = async (tran_id: string) => {
  await PaymentModel.findOneAndUpdate({ transactionId: tran_id }, { status: "failed" });
};

export const PaymentServices = {
  createCodPayment,
  createSslPayment,
  confirmSslPayment,
  failSslPayment,
};
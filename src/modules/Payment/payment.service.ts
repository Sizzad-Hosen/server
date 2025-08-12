
// ============================== Payment Service ==============================
import { PaymentModel } from "./payment.model";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import { OrderModel } from "../Orders/order.model";
import { User } from "../Users/user.model";

export const createCodPayment = async (orderId: string, userId: string) => {
  
  // ✅ Pass string directly
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

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
  const order = await OrderModel.findById(orderId).populate('user');
  if (!order) throw new Error("Order not found or already paid");

  const tran_id = uuidv4();

  if (!process.env.STORE_ID || !process.env.STORE_PASSWORD) {
    throw new Error("SSLCommerz credentials not configured");
  }

  if (!process.env.FRONTEND_URL || !process.env.SERVER_URL) {
    throw new Error("Frontend or server URL not configured");
  }

  const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false);

  const user = order.user as { email?: string } | undefined;

  const data = {
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${process.env.FRONTEND_URL}/payments/success/${tran_id}`,
    fail_url: `${process.env.FRONTEND_URL}/payments/fail/${tran_id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payments/cancel/${tran_id}`,
    ipn_url: `${process.env.SERVER_URL}/payments/ipn`,
    product_name: "Order Products",
    product_category: "Ecommerce",
    product_profile: "general",
    shipping_method: "Courier",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",

    cus_name: order.address.fullName || "Customer",
    cus_email: user?.email || "customer@example.com",
    cus_add1: order.address.fullAddress || "",
    cus_phone: order.address.phone || "",
    value_a: orderId,
    value_b: userId,
    multi_card_name: '', // Optional
    allowed_bin: '', // Optional
    emi_option: 0,
    emi_max_inst_option: 0,
    emi_selected_inst: 0,
    emi_allow_only: 0
  };

  try {
    const response = await sslcz.init(data);

    if (response.status === "FAILED") {
      throw new Error(`SSLCommerz Payment failed: ${response.failedreason}`);
    }

    if (!response.GatewayPageURL) {
      throw new Error("No GatewayPageURL received from SSLCommerz");
    }

    await PaymentModel.create({
      orderId: order._id,
      userId: order.user,
      amount: order.totalPrice,
      method: "sslcommerz",
      status: "pending",
      transactionId: tran_id,
    });

    return { GatewayPageURL: response.GatewayPageURL };
  } catch (error) {
    console.error("SSLCommerz Error:", error);
    throw new Error(`Payment initialization failed: ${error}`);
  }
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
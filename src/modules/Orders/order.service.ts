

import { OrderModel } from "./order.model";
import { generateInvoiceNumber } from "./order.utils";
import { TOrder } from "./order.interface";
import { confirmSslPayment, createCodPayment, createSslPayment } from "../Payment/payment.service";
import { User } from "../Users/user.model";
import { Cart } from "../Cart/cart.model";
import httpStatus from "http-status";
import AppError from "../../app/config/error/AppError";

const createOrder = async (orderData: TOrder, userId: string) => {


  const user = await User.findById(userId);

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No items in cart");
  }

  const totalPrice = cart.items.reduce((acc, item) => {
    const price = item.price ?? item.productId?.price;
    if (!price) throw new AppError(httpStatus.BAD_REQUEST, "Product price missing");
    return acc + price * item.quantity;
  }, 0);

  const invoiceNumber = await generateInvoiceNumber();

  

  const order = new OrderModel({
    
    user: userId,
    cart: cart._id,
    totalPrice,
    invoiceNumber,
    paymentMethod: orderData.paymentMethod,
    shippingAddress: orderData.shippingAddress,
    orderStatus: "pending",
    paymentStatus: "pending",

  });

  const savedOrder = await order.save();

  console.log("saveorder", savedOrder)

  if (order.paymentMethod === "cash_on_delivery") {
    await createCodPayment(savedOrder._id.toString(), userId);
    return savedOrder;
  }


  if (order.paymentMethod === "sslcommerz") {
    const { GatewayPageURL: paymentUrl } = await createSslPayment(savedOrder._id.toString(), userId);
    return { paymentUrl };
  }

  throw new AppError(httpStatus.BAD_REQUEST, "Unsupported payment method");
};


export const getOrderByInvoice = async (invoiceNumber: string) => {

  return await OrderModel.findOne({ invoiceNumber }).populate('user');

};


const updateOrderStatus = async (invoiceNumber: string, status: string) => {
  return await OrderModel.findOneAndUpdate(
    { invoiceNumber },
    { orderStatus: status },
    { new: true }
  );
};
export const OrderServices = { 
  createOrder,
  getOrderByInvoice,
  updateOrderStatus

 };
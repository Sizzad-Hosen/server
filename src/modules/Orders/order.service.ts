

import { OrderModel } from "./order.model";
import { generateInvoiceId } from "./order.utils";
import { TOrder } from "./order.interface";
import {  createCodPayment, createSslPayment } from "../Payment/payment.service";
import { User } from "../Users/user.model";
import { Cart } from "../Cart/cart.model";
import httpStatus from "http-status";
import AppError from "../../app/config/error/AppError";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { ordersSearchableField } from "./order.constance";

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

  const invoiceId = await generateInvoiceId();

  

  const order = new OrderModel({

    user: userId,
    cart: cart._id,
    totalPrice,
    invoiceId,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address,
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


export const getAllOrders = async (query: any) => {

  try {
    
    const orderQuery = new QueryBuilder(OrderModel.find(), query)
      .search(ordersSearchableField)
      .sort()
      .filter()
      .paginate()
      .fields();

    orderQuery.modelQuery = orderQuery.modelQuery
      .populate('user')
      .populate('cart')
      .populate('address')
   

    await orderQuery.countTotal();

    const customOrders = await orderQuery.modelQuery.exec();

    return {
      data: customOrders,
      meta: {
        total: orderQuery.total,
        page: orderQuery.page,
        limit: orderQuery.limit,
        totalPages: orderQuery.totalPages,
      },
    };
  } catch (error) {
    console.error('getOrdersService error:', error);
    throw error; // Ensure the error is properly propagated
  }
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
  updateOrderStatus,
  getAllOrders

 };
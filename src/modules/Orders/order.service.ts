

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

interface ICartItem {
  price?: number;
  productId?: { price?: number };
  quantity: number;
}
const createOrder = async (orderData: TOrder, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No items in cart");
  }


  const totalPrice = cart.items.reduce((acc: number, item: ICartItem) => {
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

  // Clear the cart after order is saved
  cart.items = [];
  await cart.save();

  console.log("saveorder", savedOrder);

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



export const getOrderByInvoice = async (invoiceId: string) => {

  return await OrderModel.findOne({ invoiceId }).populate('user');

};


export const getAllOrders = async (query: any, role: string, userId?: string) => {
  try {
    let baseQuery = OrderModel.find();

    // If user is not admin, filter orders by user and exclude soft-deleted
    if (role !== 'admin') {
      baseQuery = baseQuery.where({
        user: userId,
        deletedByUser: false,
      });
    }

    const orderQuery = new QueryBuilder(baseQuery, query)
      .search(ordersSearchableField)
      .sort()
      .filter()
      .paginate()
      .fields();

    orderQuery.modelQuery = orderQuery.modelQuery
      .populate('user')
      .populate('cart')
      .populate('address');

    await orderQuery.countTotal();

    const orders = await orderQuery.modelQuery.exec();

    return {
      data: orders,
      meta: {
        total: orderQuery.total,
        page: orderQuery.page,
        limit: orderQuery.limit,
        totalPages: orderQuery.totalPages,
      },
    };
  } catch (error) {
    console.error('getAllOrders error:', error);
    throw error;
  }
};


export const getAllOrdersByUserId = async (userId: string) => {
  try {
    
    console.log("ser userId", userId)

    const orders = await OrderModel.find({
      user: userId,
      deletedByUser: false, 
    })
      .populate("user")
      .populate("cart");

    console.log(orders);

    return orders;
  } catch (error) {
    throw new Error("Failed to fetch orders for the user");
  }
};


const updateOrderStatus = async (invoiceId: string, status: string) => {
  return await OrderModel.findOneAndUpdate(
    { invoiceId },
    { orderStatus: status },
    { new: true }
  );
};

const updateOrderPaymentStatus = async (invoiceId: string, status: string) => {

  return await OrderModel.findOneAndUpdate(

    { invoiceId },

    { paymentStatus:status },

    { new: true }
  );
};

export const deleteSingleOrderById = async (id: string, role:string) => {

 if (role === "admin") {
    // Hard delete
    return await OrderModel.findByIdAndDelete(id);
  } else {
    // Soft delete (for regular users)
    const order = await OrderModel.findById(id);
    if (!order) return null;

    order.deletedByUser = true;
    await order.save();
    return order;
  }
};


export const OrderServices = { 
  createOrder,
  getOrderByInvoice,
  updateOrderStatus,
  getAllOrders,
  updateOrderPaymentStatus,
  getAllOrdersByUserId,
  deleteSingleOrderById
  

 };
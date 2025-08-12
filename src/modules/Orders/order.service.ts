

import { OrderModel } from "./order.model";
import { generateInvoiceId } from "./order.utils";
import { TOrder, TOrderItem } from "./order.interface";
import { createCodPayment, createSslPayment } from "../Payment/payment.service";
import { User } from "../Users/user.model";
import { Cart } from "../Cart/cart.model";
import httpStatus from "http-status";
import AppError from "../../app/config/error/AppError";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { ordersSearchableField } from "./order.constance";
import { title } from "process";
import { Types } from "mongoose";

type CartItem = {
  productId: {
    _id: Types.ObjectId;
    title: string;
    price?: number;
    image?: string;
  };
  price?: number;
  quantity: number;
  image?: string;
};

export const createOrder = async (
  orderData: TOrder,
  userId: string
): Promise<TOrder> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const cart = await Cart.findOne({ userId }).populate<{ items: Array<{ productId: { _id: Types.ObjectId; title: string; price?: number; image?: string } }> }>("items.productId");

  if (!cart || !cart.items.length) throw new Error("Cart is empty");

  const items: TOrderItem[] = cart.items.map((item: CartItem) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.price ?? item.productId.price ?? 0,
    quantity: item.quantity,
    image: item.image ?? item.productId.image ?? "https://via.placeholder.com/300x300.png?text=No+Image",
  }));
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const invoiceId = await generateInvoiceId();

  const order = new OrderModel({
    user: userId,
    cart: cart._id,
    items,
    invoiceId,
    totalPrice,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address,
    orderStatus: "pending",
    paymentStatus: "pending",
    deliveryOption: orderData.deliveryOption,
    siteNote: orderData.siteNote ?? "",
  });

  const savedOrder = await order.save();

  // Clear cart items after order saved
  cart.items = [];
  await cart.save();

  return savedOrder.toObject();
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
    console.log("ser userId", userId);

    const orders = await OrderModel.find({
      user: userId,
      deletedByUser: false,
    })
      .populate("user")


    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
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

    { paymentStatus: status },

    { new: true }
  );
};

export const deleteSingleOrderById = async (id: string, role: string) => {

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
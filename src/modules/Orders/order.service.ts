import { OrderModel } from "./order.model";
import { generateInvoiceId } from "./order.utils";
import { TOrder, TOrderItem } from "./order.interface";
import { User } from "../Users/user.model";
import { Cart } from "../Cart/cart.model";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { ordersSearchableField } from "./order.constance";
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
  discount?: number;
  selectedSize?: { label: string; price: number };
};

export const createOrder = async (
  orderData: TOrder,
  userId: string
): Promise<TOrder> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const cart = await Cart.findOne({ userId }).populate<{
    items: Array<CartItem>;
  }>("items.productId");

  if (!cart || !cart.items.length) throw new Error("Cart is empty");

  // Map cart items → order items
  const items: TOrderItem[] = cart.items.map((item: CartItem) => {
    const basePrice = item.price ?? item.productId.price ?? 0;
    const quantity = item.quantity;
    const discount = item.discount ?? 0;
    const selectedSize = item.selectedSize ?? { label: "Default", price: basePrice };

    const totalAmount = (basePrice * quantity) - ((basePrice * quantity * discount) / 100);

    return {
      productId: item.productId._id,
      title: item.productId.title,
      price: basePrice,
      quantity,
      image: item.image ?? item.productId.image ?? "https://via.placeholder.com/300x300.png?text=No+Image",
      discount,
      selectedSize,
      totalAmount, // ✅ now part of TOrderItem
    };
  });

  // Calculate totals
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);

  // Shipping cost
  const shippingCost = orderData.deliveryOption === "insideRangpur" ? 0 : 50;
  const grandTotal = totalAmount + shippingCost;

  const invoiceId = await generateInvoiceId();

  const order = new OrderModel({
    user: userId,
    cart: cart._id,
    items,
    invoiceId,
    totalQuantity,
    totalAmount,
    grandTotal,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address,
    orderStatus: "pending",
    paymentStatus: "pending",
    deliveryOption: orderData.deliveryOption,
    siteNote: orderData.siteNote ?? "",
  });

  const savedOrder = await order.save();

  // Clear cart
  cart.items = [];
  await cart.save();

  return savedOrder.toObject();
};

export const getOrderByInvoice = async (invoiceId: string) => {
  return await OrderModel.findOne({ invoiceId }).populate("user");
};

export const getAllOrders = async (query: any, role: string, userId?: string) => {
  try {
    let baseQuery = OrderModel.find();

    if (role !== "admin") {
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
      .populate("user")
      .populate("cart")
      .populate("address");

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
    console.error("getAllOrders error:", error);
    throw error;
  }
};

export const getAllOrdersByUserId = async (userId: string) => {
  try {
    const orders = await OrderModel.find({
      user: userId,
      deletedByUser: false,
    }).populate("user");

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders for the user");
  }
};

export const updateOrderStatus = async (invoiceId: string, status: string) => {
  return await OrderModel.findOneAndUpdate(
    { invoiceId },
    { orderStatus: status },
    { new: true }
  );
};

export const updateOrderPaymentStatus = async (invoiceId: string, status: string) => {
  return await OrderModel.findOneAndUpdate(
    { invoiceId },
    { paymentStatus: status },
    { new: true }
  );
};

export const deleteSingleOrderById = async (id: string, role: string) => {
  if (role === "admin") {
    return await OrderModel.findByIdAndDelete(id);
  } else {
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
  deleteSingleOrderById,
};

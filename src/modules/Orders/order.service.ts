import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { generateInvoiceNumber } from "./order.utils";

export const createOrder = async (orderData: TOrder): Promise<TOrder> => {
  const invoiceNumber = await generateInvoiceNumber();
  const newOrder = new OrderModel({ ...orderData, invoiceNumber });
  return await newOrder.save();
};

export const getOrderById = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate("paymentId").populate("shippingAddressId");
};


export const OrderServices = {
  createOrder,
  getOrderById
}
import { OrderModel } from "./order.model";
import { generateInvoiceNumber } from "./order.utils";
import { TOrder } from "./order.interface";
import { confirmSslPayment, createCodPayment } from "../Payment/payment.service";
import { User } from "../Users/user.model";
import { Cart } from "../Cart/cart.model";
import httpStatus from "http-status";
import AppError from "../../app/config/error/AppError";

const createOrder = async (orderData: TOrder, userId: string) => {
  // 1. Validate User
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // 2. Get Cart by userId (check if Cart uses `user` or `userId`)
  const cart = await Cart.findOne({userId }).populate("items.productId");

  console.log("cart item ",cart)

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No items in cart");
  }

  // 3. Calculate total price from cart items
  // Here price should come from the populated productId, if price is not directly stored on item
  const totalPrice = cart.items.reduce((acc, item) => {
    const price = item.price ?? item.productId?.price;
    if (!price) throw new AppError(httpStatus.BAD_REQUEST, "Product price missing");
    return acc + price * item.quantity;
  }, 0);

  // 4. Generate unique invoice number
  const invoiceNumber = await generateInvoiceNumber();

  // 5. Create order document
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

  // 6. Handle payment based on payment method
  if (orderData.paymentMethod === "cash_on_delivery") {
    await createCodPayment({
      orderId: savedOrder._id,
      userId,
      amount: totalPrice,
      method: "cash_on_delivery",  // exact enum value in Payment model
      status: "success",
    });

    return savedOrder;
  }

  if (orderData.paymentMethod === "sslcommerz") {
    const paymentUrl = await confirmSslPayment(savedOrder._id.toString());
    return { paymentUrl };
  }

  throw new AppError(httpStatus.BAD_REQUEST, "Unsupported payment method");
};


export const OrderServices = {
  createOrder,
};

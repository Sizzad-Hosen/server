import SSLCommerzPayment from "sslcommerz-lts";
import { TOrder } from "../modules/Orders/order.interface";



export const initiateSSLCommerzSession = async (order: TOrder, paymentId: string) => {

  const data = {
    total_amount: order.totalPrice,
    currency: 'BDT',
    tran_id: paymentId,
    success_url: `${process.env.SERVER_URL}/api/payment/success/${order._id}`,
    fail_url: `${process.env.SERVER_URL}/api/payment/fail/${order._id}`,
    cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${order._id}`,
    ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
    shipping_method: 'Courier',
    product_name: 'E-commerce order',
    product_category: 'Mixed',
    product_profile: 'general',
    cus_name: 'Customer',
    cus_email: 'test@example.com',
    cus_add1: order.shippingAddress.location,
    cus_city: order.shippingAddress.district,
    cus_country: 'Bangladesh',
    cus_phone: order.shippingAddress.phoneNumber,
  };

  const sslcz = new SSLCommerzPayment(process.env.STORE_ID!, process.env.STORE_PASSWORD!, process.env.SSL_COMMERZ_MODE === 'live');

  const response = await sslcz.init(data);

  return response;
};

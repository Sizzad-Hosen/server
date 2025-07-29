// services/CustomBazerOrder.service.ts

import { CustomBazerProductModel } from '../CustomBazerProduct/customBazerProduct.model';
import { User } from '../Users/user.model';
import { TCustomBazerOrder } from './CustomBazerOrder.interface';
import { CustomBazerOrderModel } from './CustomBazerOrder.model';

import { Types } from 'mongoose';

export const createOrderService = async (userId: string, payload: Omit<TCustomBazerOrder, 'user'>) => {


  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found !!');
  }

  let totalAmount = 0;


  const orderItemsWithPrices = await Promise.all(
    payload.orderItems.map(async (item) => {
      const product = await CustomBazerProductModel.findById(item.product);

      if (!product) {
        throw new Error(`Product not found with id: ${item.product}`);
      }

      const totalPrice = item.quantity * product.pricePerUnit;
      totalAmount += totalPrice;

      return {
        product: item.product,
        quantity: item.quantity,
        totalPrice,
      };
    })
  );

  const finalPayload: TCustomBazerOrder = {
    user: userId,
    orderItems: orderItemsWithPrices,
    totalAmount,
    status: payload.status ?? 'pending',
  };

  // অর্ডার সেভ করুন
  const createdOrder = await CustomBazerOrderModel.create(finalPayload);

  return createdOrder;
};

export const getOrdersService = async () => {
return await CustomBazerOrderModel.find()
.populate('user')
.populate('orderItems.product'); // ✅ correct path
};

export const getSingleOrderService = async (id: string) => {
return await CustomBazerOrderModel.findById(id)
.populate('user')
.populate('orderItems.product'); // ✅ correct path
};

export const CustomBazerOrderServices = {
  createOrderService,
  getOrdersService,
  getSingleOrderService,
};

// services/CustomBazerOrder.service.ts

import { CustomBazerProductModel } from '../CustomBazerProduct/customBazerProduct.model';
import { User } from '../Users/user.model';
import { TCustomBazerOrder } from './CustomBazerOrder.interface';

import { Types } from 'mongoose';
import CustomBazarOrder from './CustomBazerOrder.model';


export const createOrderService = async (
  userId: string,
  payload: Omit<TCustomBazerOrder, 'user' | 'totalAmount'>
) => {
  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found !!');
  }

  let totalAmount = 0;

  // Process each order item
  const orderItemsWithPrices = await Promise.all(
    payload.orderItems.map(async (item) => {
      // Find the product
      const product = await CustomBazerProductModel.findById(item.product);
      console.log("products", product)


      if (!product) {
        throw new Error(`Product not found with id: ${item.product}`);
      }

      // Find the subcategory in product.subcategories by name
      const subcategory = product.subcategories.find(
        (sub) => sub.name === item.subcategoryName
      );

      if (!subcategory) {
        throw new Error(
          `Subcategory '${item.subcategoryName}' not found in product '${product.category}'`
        );
      }

      // Validate quantity
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Invalid quantity: ${item.quantity}`);
      }

      // Use pricePerUnit from subcategory
      const pricePerUnit = subcategory.pricePerUnit;

      // Calculate total price for this item
      const totalPrice = item.quantity * pricePerUnit;

      totalAmount += totalPrice;

      return {
        product: item.product,
        subcategoryName: item.subcategoryName,
        unit: item.unit,
        pricePerUnit,
        quantity: item.quantity,
        totalPrice,
      };
    })
  );

  // Compose final payload for order
  const finalPayload: TCustomBazerOrder = {
    user: new Types.ObjectId(userId),
    orderItems: orderItemsWithPrices,
    totalAmount,
    status: payload.status ?? 'pending',
    paymentMethod: payload.paymentMethod,
    address: payload.address,
    siteNote: payload.siteNote,
  };

  // Save the order
  const createdOrder = await CustomBazarOrder.create(finalPayload);

  return createdOrder;
};
export const getOrdersService = async () => {
  return await CustomBazarOrder.find()
    .populate('user')
    .populate('orderItems.product'); // ✅ correct path
};

export const getSingleOrderService = async (id: string) => {
  return await CustomBazarOrder.findById(id)
    .populate('user')
    .populate('orderItems.product'); // ✅ correct path
};

export const CustomBazerOrderServices = {
  createOrderService,
  getOrdersService,
  getSingleOrderService,
};

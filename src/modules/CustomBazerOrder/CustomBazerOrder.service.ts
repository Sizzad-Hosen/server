// services/CustomBazerOrder.service.ts

import { CustomBazerProductModel } from '../CustomBazerProduct/customBazerProduct.model';
import { User } from '../Users/user.model';
import { TCustomBazerOrder } from './CustomBazerOrder.interface';

import { Types } from 'mongoose';
import CustomBazarOrder from './CustomBazerOrder.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { customBazarGenerateInvoiceId, customBazarSearchableField } from './CustomBazerOrder.constance';



export const createOrderService = async (
  userId: string,
  payload: Omit<TCustomBazerOrder, 'user' | 'totalAmount' | 'invoiceId'>
) => {
  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found !!');
  }

  let totalAmount = 0;

  // Process order items
  const orderItemsWithPrices = await Promise.all(
    payload.orderItems.map(async (item) => {
      const product = await CustomBazerProductModel.findById(item.product);
      if (!product) throw new Error(`Product not found with id: ${item.product}`);

      const subcategory = product.subcategories.find(sub => sub.name === item.subcategoryName);
      if (!subcategory)
        throw new Error(`Subcategory '${item.subcategoryName}' not found in product '${product.category}'`);

      if (typeof item.quantity !== 'number' || item.quantity <= 0)
        throw new Error(`Invalid quantity: ${item.quantity}`);

      const pricePerUnit = subcategory.pricePerUnit;
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

  let invoiceId = customBazarGenerateInvoiceId();

  // Optional: Ensure unique invoiceId by checking DB, simple example with retry:
  const maxRetries = 5;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    const existing = await CustomBazarOrder.findOne({ invoiceId });
    if (!existing) break; // unique found
    invoiceId = customBazarGenerateInvoiceId();
    retryCount++;
  }
  if (retryCount === maxRetries) throw new Error('Failed to generate unique invoiceId');

  const finalPayload: TCustomBazerOrder = {
    user: new Types.ObjectId(userId),
    orderItems: orderItemsWithPrices,
    totalAmount,
    invoiceId,
    status: payload.status ?? 'pending',
    paymentMethod: payload.paymentMethod,
    address: payload.address,
    siteNote: payload.siteNote,
  };

  const createdOrder = await CustomBazarOrder.create(finalPayload);
  return createdOrder;
};


export const getOrdersService = async (query: any) => {
  const customBazarOrderQuery = new QueryBuilder(CustomBazarOrder.find(), query)
    .search(customBazarSearchableField)
    .sort()
    .filter()
    .paginate()
    .fields();

  // Apply populate on the underlying Mongoose Query instance
  customBazarOrderQuery.modelQuery = customBazarOrderQuery.modelQuery
    .populate('user')
    .populate('orderItems.product');

  // Await total count for pagination metadata
  await customBazarOrderQuery.countTotal();

  // Execute the query and await the result
  const customOrders = await customBazarOrderQuery.modelQuery.exec();

  return {
    data: customOrders,
    meta: {
      total: customBazarOrderQuery.total,
      page: customBazarOrderQuery.page,
      limit: customBazarOrderQuery.limit,
      totalPages: customBazarOrderQuery.totalPages,
    },
  };
};

export const getSingleOrderService = async (id: string) => {
  return await CustomBazarOrder.findById(id)
    .populate('user')
    .populate('orderItems.product');


};

export const CustomBazerOrderServices = {
  createOrderService,
  getOrdersService,
  getSingleOrderService,
};

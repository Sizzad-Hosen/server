// services/CustomBazerOrder.service.ts

import { CustomBazerProductModel } from '../CustomBazerProduct/customBazerProduct.model';
import { User } from '../Users/user.model';
import { TCustomBazerOrder } from './CustomBazerOrder.interface';

import mongoose, { Types } from 'mongoose';
import CustomBazarOrder from './CustomBazerOrder.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { customBazarGenerateInvoiceId, customBazarSearchableField } from './CustomBazerOrder.constance';


export const createOrderService = async (
  userId: string,
  payload: Omit<TCustomBazerOrder, 'user' | 'totalAmount' | 'invoiceId'>
) => {
  // Validate user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found!');
  }

  let totalAmount = 0;

  // Calculate total and validate items
  const orderItemsWithPrices = await Promise.all(
    payload.orderItems.map(async (item) => {
      const product = await CustomBazerProductModel.findById(item.product);
      if (!product) {
        throw new Error(`Product not found with id: ${item.product}`);
      }

      const subcategory = product.subcategories.find(
        (sub) => sub.name === item.subcategoryName
      );

      if (!subcategory) {
        throw new Error(
          `Subcategory '${item.subcategoryName}' not found in product '${product.category}'`
        );
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error(`Invalid quantity: ${item.quantity}`);
      }

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

  // Generate unique invoiceId with validation
  let invoiceId = await customBazarGenerateInvoiceId();
  const maxRetries = 5;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    const existing = await CustomBazarOrder.findOne({ invoiceId });
    if (!existing) break; // Unique invoiceId found
    invoiceId = await customBazarGenerateInvoiceId(); // Retry with a new one
    retryCount++;
  }

  if (retryCount === maxRetries) {
    throw new Error('Failed to generate a unique invoiceId');
  }

  // Final order payload
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

  // Create order
  const createdOrder = await CustomBazarOrder.create(finalPayload);
  return createdOrder;
};
export const getOrdersService = async (query: any, role: string, userId?: string) => {
  try {
    let baseQuery = CustomBazarOrder.find();

    // ✅ Role-based visibility control
    if (role !== 'admin') {
      baseQuery = baseQuery.where({
        user: userId,
        deletedByUser: false,
      });
    }

    // Use custom query builder
    const customBazarOrderQuery = new QueryBuilder(baseQuery, query)
      .search(customBazarSearchableField)
      .sort()
      .filter()
      .paginate()
      .fields();

    // Populate references
    customBazarOrderQuery.modelQuery = customBazarOrderQuery.modelQuery
      .populate('user')
      .populate('orderItems.product');

    // Count total before pagination
    await customBazarOrderQuery.countTotal();

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
  } catch (error) {
    console.error('getOrdersService error:', error);
    throw error;
  }
};

export const getSingleOrderService = async (id: string) => {
  return await CustomBazarOrder.findById(id)
    .populate('user')
    .populate('orderItems.product');


};


const updateOrderStatus = async (invoiceId: string, status: string) => {

  return await CustomBazarOrder.findOneAndUpdate(

    { invoiceId },
    { status },
    { new: true }
  );
};

export const getAllCustomOrdersByUserId = async (userId: string) => {
  try {

    const orders = await CustomBazarOrder.find({ user: userId ,  deletedByUser: false }).populate("user").populate('orderItems.product');

    console.log(orders);

    return orders;
  } catch (error) {
    throw new Error("Failed to fetch orders for the user");
  }
};

// services/customBazerOrder.service.ts

export const deleteSingleOrderById = async (id: string, role: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; // invalid ID format
  }

  if (role === "admin") {
    // Hard delete
    return await CustomBazarOrder.findByIdAndDelete(id);
  } else {
    // Soft delete (for regular users)
    const order = await CustomBazarOrder.findById(id);

    if (!order) return null;

    order.deletedByUser = true;
    await order.save();
    return order;
  }
};
export const CustomBazerOrderServices = {
  createOrderService,
  getOrdersService,
  getSingleOrderService,
  updateOrderStatus,
  getAllCustomOrdersByUserId,
  deleteSingleOrderById
};

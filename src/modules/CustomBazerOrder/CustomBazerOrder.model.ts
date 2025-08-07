import { Schema, model, models, Types } from 'mongoose';

const customBazarOrderItemSchema = new Schema({
  product: {
    type: Types.ObjectId,
    ref: 'CustomBazerProduct',
    required: true,
  },
  subcategoryName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'gm', 'piece', 'litre'],
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const customBazarOrderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: {
      type: [customBazarOrderItemSchema],
      required: true,
      validate: {
        validator: (value: any[]) => value.length > 0,
        message: 'Order must contain at least one item.',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
     enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],

      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['sslcommerz', 'cash_on_delivery'],
      required: true,
    },
    address: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      fullAddress: { type: String, required: true },
    },
      deletedByUser: {
      type: Boolean,
      default: false,
    },
    invoiceId:{
 type: String,
 required: true,
    },
    siteNote: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const CustomBazarOrder = model('CustomBazarOrder', customBazarOrderSchema);

export default CustomBazarOrder;

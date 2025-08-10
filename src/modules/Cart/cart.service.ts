import { Cart } from './cart.model';
import { TCartItem } from './cart.interface';
import AppError from '../../app/config/error/AppError';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

const getCartByUser = async (userId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');
  }
  return cart;
};

const addOrUpdateCartItem = async (userId: string, item: TCartItem) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [item],
      totalQuantity: item.quantity,
      totalAmount: item.price * item.quantity,
    });
  } else {
    const existingItem = cart.items.find(
      (i: TCartItem) => i.productId.toString() === item.productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;

      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (i: TCartItem) => i.productId.toString() !== item.productId.toString()
        );
      }
    } else {
      if (item.quantity > 0) {
        cart.items.push(item);
      }
    }

    cart.totalQuantity = cart.items.reduce(
      (sum: number, i: TCartItem) => sum + i.quantity,
      0
    );
    cart.totalAmount = cart.items.reduce(
      (sum: number, i: TCartItem) => sum + i.quantity * i.price,
      0
    );

    await cart.save();
  }

  return cart;
};

const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');
  }

  const item = cart.items.find(
    (i: TCartItem) => i.productId.toString() === productId.toString()
  );

  if (!item) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found in cart');
  }

  cart.items = cart.items.filter(
    (i: TCartItem) => i.productId.toString() !== productId.toString()
  );

  cart.totalQuantity = cart.items.reduce((sum: number, i: TCartItem) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum: number, i: TCartItem) => sum + i.quantity * i.price,
    0
  );

  await cart.save();
  return cart;
};

const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (i: TCartItem) => i.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new AppError(404, 'Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.totalQuantity = cart.items.reduce((sum: number, i: TCartItem) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce(
    (sum: number, i: TCartItem) => sum + i.quantity * i.price,
    0
  );

  await cart.save();
  return cart;
};

const checkoutCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart is empty or not found');
  }

  const orderSummary = {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
  };

  // Clear cart after checkout
  await Cart.findOneAndDelete({ userId });

  return orderSummary;
};

const clearCart = async (userId: string) => {
  const cart = await Cart.findOneAndDelete({ userId });
  if (!cart) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart already empty or not found');
  }
  return cart;
};

export const CartServices = {
  getCartByUser,
  addOrUpdateCartItem,
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
  checkoutCart,
};

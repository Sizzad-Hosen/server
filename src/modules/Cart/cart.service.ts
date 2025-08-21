import { Cart } from './cart.model';
import { TCartItem, TCart } from './cart.interface';
import AppError from '../../app/config/error/AppError';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

// --- Utility: Calculate discounted price ---
const getDiscountedPrice = (price: number, discount: number = 0): number => {
  if (price <= 0) return 0;
  if (!discount || discount <= 0) return price;
  return price - (price * discount) / 100;
};

// --- Utility: Recalculate totals ---
const recalcCartTotals = (cart: any) => {
  cart.subtotal = 0;
  cart.discountTotal = 0;
  cart.grandTotal = 0;
  cart.totalQuantity = 0;
  cart.totalAmount = 0;

  let subtotal = 0;
  let discountTotal = 0;
  let totalQuantity = 0;

  cart.items.forEach((item: any) => {
    const basePrice = item.selectedSize?.price ?? item.price;
    const itemBaseTotal = basePrice * item.quantity;

    console.log("itemBaseTotal", itemBaseTotal)
    console.log("item.discount", item.discount)

    const itemDiscount =
      item.discount && item.discount > 0
        ? (itemBaseTotal * item.discount) / 100
        : 0;

    const itemTotal = itemBaseTotal - itemDiscount;

console.log("itemTotal", itemTotal)

    // attach calculation to each item
    item.itemBaseTotal = itemBaseTotal;
    item.itemDiscount = itemDiscount;
    item.itemTotal = itemTotal;

    subtotal += itemBaseTotal;
    discountTotal += itemDiscount;
    totalQuantity += item.quantity;
    console.log("subtotal", subtotal)

    console.log("discountTotal", discountTotal)
    console.log("totalQuantity", totalQuantity)


  });

  cart.subtotal = subtotal;
  cart.discountTotal = discountTotal;
  cart.grandTotal = subtotal - discountTotal;
  cart.totalQuantity = totalQuantity;
  cart.totalAmount = cart.grandTotal;

  return cart;
};

// --- Get cart for a user ---
const getCartByUser = async (userId: string): Promise<TCart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');
  return cart;
};

// --- Add or Update Cart Item ---
const addOrUpdateCartItem = async (userId: string, item: TCartItem): Promise<TCart> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
  }

  if (
    !item.productId ||
    !item.title ||
    !item.selectedSize ||
    item.selectedSize.price == null ||
    !item.selectedSize.label ||
    item.quantity == null
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required cart item fields including selectedSize');
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [item],
    });
    recalcCartTotals(cart);
    await cart.save();
    return cart;
  }

  // Ensure old items have selectedSize fallback
  cart.items.forEach((existingItem: TCartItem) => {
    if (!existingItem.selectedSize) {
      existingItem.selectedSize = { label: 'Default', price: existingItem.price };
    }
  });

  // Find existing product with same productId + size
  const existingItemIndex = cart.items.findIndex(
    (i: TCartItem) =>
      i.productId.toString() === item.productId.toString() &&
      i.selectedSize.label === item.selectedSize.label
  );

  if (existingItemIndex >= 0) {
    const existingItem = cart.items[existingItemIndex];
    existingItem.quantity += item.quantity;
    existingItem.discount = item.discount ?? 0;
  } else {
    cart.items.push(item);
  }

  recalcCartTotals(cart);
  await cart.save();
  return cart;
};

// --- Remove from Cart ---
const removeFromCart = async (userId: string, productId: string): Promise<TCart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');

  const index = cart.items.findIndex((i: TCartItem) => i.productId.toString() === productId.toString());
  if (index === -1) throw new AppError(httpStatus.BAD_REQUEST, 'Product not found in cart');

  cart.items.splice(index, 1);
  recalcCartTotals(cart);
  await cart.save();

  return cart;
};

const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  newQuantity: number
): Promise<TCart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(httpStatus.BAD_REQUEST, 'Cart not found');

  const index = cart.items.findIndex(
    (i: TCartItem) => i.productId.toString() === productId.toString()
  );
  if (index === -1) throw new AppError(httpStatus.NOT_FOUND, 'Item not found in cart');

  if (newQuantity <= 0) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].quantity = newQuantity; // <-- direct set, not add
  }

  recalcCartTotals(cart);
  await cart.save();
  return cart;
};

// --- Checkout ---
const checkoutCart = async (
  userId: string
): Promise<{ items: TCartItem[]; totalQuantity: number; totalAmount: number }> => {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cart is empty or not found');
  }

  const summary = {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
  };

  await Cart.findOneAndDelete({ userId }); // clear cart after checkout
  return summary;
};

// --- Clear Cart ---
const clearCart = async (userId: string): Promise<TCart> => {
  const cart = await Cart.findOneAndDelete({ userId });
  if (!cart) throw new AppError(httpStatus.BAD_REQUEST, 'Cart already empty or not found');
  return cart;
};

export const CartServices = {
  getCartByUser,
  addOrUpdateCartItem,
  removeFromCart,
  updateCartItemQuantity,
  checkoutCart,
  clearCart,
};

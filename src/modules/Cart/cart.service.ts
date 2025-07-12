import AppError from "../../app/config/error/AppError";
import { TCart, TCartItem } from "./cart.interface";
import { Cart } from "./cart.model";

const getCart = async (userId: string) => {
  return await Cart.findOne({ userId });
};


/**
 * Adds a product to a user's cart.
 * If cart does not exist → creates new cart.
 * If product already exists → increases quantity.
 * If quantity becomes 0 → removes the product.
 */

export const addToCart = async (userId: string, item: TCartItem) => {
  console.log('🛒 Incoming item:', item);
  console.log('🔍 Looking for cart of user:', userId);

  let cart = await Cart.findOne({ userId });

  try {
    if (!cart) {
      console.log('📭 No existing cart found. Creating a new cart...');
      cart = await Cart.create({
        userId,
        items: [item],
        totalAmount: item.price * item.quantity,
        totalQuantity: item.quantity,
      });
      console.log('✅ New cart created:', cart);
    } else {
      console.log('✅ Existing cart found:', cart);

      const existingItem = cart.items.find(
        (i) => i.productId.toString() === item.productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        if (existingItem.quantity <= 0) {
          cart.items = cart.items.filter(
            (i) => i.productId.toString() !== item.productId.toString()
          );
        }
      } else {
        if (item.quantity > 0) {
          cart.items.push(item);
        }
      }

      cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

      await cart.save();
      console.log('🧾 Cart updated and saved:', cart);
    }

    return cart;
  } catch (error: any) {
    console.error("❌ Error adding to cart:", error.message || error);
    throw error;
  }
};



const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  const item = cart.items.find(i => i.productId.toString() === productId);
  if (!item) return cart;

  cart.items = cart.items.filter(i => i.productId.toString() !== productId);
  cart.totalQuantity -= item.quantity;
  cart.totalAmount -= item.price * item.quantity;

  await cart.save();
  return cart;
};

const clearCart = async (userId: string) => {
  return await Cart.findOneAndDelete({ userId });
};

export const CartServices = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

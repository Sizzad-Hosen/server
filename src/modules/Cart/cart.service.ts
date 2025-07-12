
import { Cart } from './cart.model'; // your mongoose model
import { TCartItem } from './cart.interface';

const getCartByUser = async (userId: string) => {
  return await Cart.findOne({ userId });
};

const addOrUpdateCartItem = async (userId: string, item: TCartItem) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // No cart exists, create new cart
    cart = await Cart.create({
      userId,
      items: [item],
      totalQuantity: item.quantity,
      totalAmount: item.price * item.quantity,
    });
  } else {
    // Cart exists, update or add item
    const existingItem = cart.items.find(i => i.productId.toString() === item.productId.toString());

    if (existingItem) {
      existingItem.quantity += item.quantity;

      // Remove item if quantity falls below or equal 0
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(i => i.productId.toString() !== item.productId.toString());
      }
    } else {
      if (item.quantity > 0) {
        cart.items.push(item);
      }
    }

    // Recalculate totalQuantity and totalAmount
    cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
  }

  return cart;
};

const clearCart = async (userId: string) => {
  return await Cart.findOneAndDelete({ userId });
};

export const CartServices = {
  getCartByUser,
  addOrUpdateCartItem,
  clearCart,
};

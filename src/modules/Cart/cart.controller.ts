import { Request, Response } from 'express';
import { CartServices } from './cart.service';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../app/config/error/AppError';



const getUserId = (req: Request): string => {

  const user = (req as any).user;
  if (!user || !user.userId) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  return user.userId;
};

// Get Cart
export const getCartController = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const cart = await CartServices.getCartByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User cart fetched successfully',
    data: cart || { items: [], totalQuantity: 0, totalAmount: 0 },
  });
});

// Add or update item in cart
export const addToCartController = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const item = req.body;
  if (!item?.productId || item?.quantity == null || item?.price == null) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required cart item fields');
  }

  const updatedCart = await CartServices.addOrUpdateCartItem(userId, item);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart updated successfully',
    data: updatedCart,
  });
});

// Clear Cart
export const clearCartController = catchAsync(async (req: Request, res: Response) => {
  
  const userId = getUserId(req);

  const result = await CartServices.clearCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully',
    data: result,
  });
});

// Remove item from cart
export const removeFromCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = getUserId(req);

  const { productId } = req.params

  if (!productId) throw new AppError(httpStatus.BAD_REQUEST, 'Product ID is required');

  const cart = await CartServices.removeFromCart(userId, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product removed from cart',
    data: cart,
  });
});

// Update item quantity
export const updateCartItemController = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const { productId } = req.params

  const { quantity } = req.body;
  
  if (!productId || quantity == null) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product ID and quantity are required');
  }

  const result = await CartServices.updateCartItemQuantity(userId, productId, quantity);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart quantity updated',
    data: result,
  });
});

// Checkout cart
export const checkoutCartController = catchAsync(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const result = await CartServices.checkoutCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout successful. Cart cleared.',
    data: result,
  });
});

// Export grouped controllers
export const CartControllers = {
  getCartController,
  addToCartController,
  clearCartController,
  removeFromCartController,
  updateCartItemController,
  checkoutCartController,
};

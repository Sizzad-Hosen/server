// controllers/cart.controller.ts
import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import { CartServices } from './cart.service';
import sendResponse from '../../app/utils/sendResponse';
import AppError from '../../app/config/error/AppError';


export const getCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId;

  const cart = await CartServices.getCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart fetched successfully',
    data: cart,
  });
});

export const addToCartController = catchAsync(async (req, res) => {
  const userId = req.user?._id; // Or from token/session if available
  const { items } = req.body;

  if (!userId) throw new AppError("User ID missing", 401);

  if (!items || !Array.isArray(items) || items.length === 0) {

    throw new AppError("No items to add", 400);
  }

  const item = items[0]; // Extract single item

  const updatedCart = await CartServices.addToCart(userId, item); 

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item added to cart",
    data: updatedCart,
  });
});

export const removeFromCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId;

  const { productId } = req.body;

  const result = await CartServices.removeFromCart(userId, productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Item removed from cart',
    data: result,
  });
});

export const checkoutCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId;

  const result = await CartServices.clearCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart checked out successfully',
    data:result
  });
});



export const CartControllers = {
    addToCartController,
    removeFromCartController,
    checkoutCartController,
    getCartController
}
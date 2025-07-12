import { Request, Response } from 'express';
import { CartServices } from './cart.service';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';

export const getCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId; 

  const cart = await CartServices.getCartByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User cart fetched successfully',
    data: cart || { items: [], totalQuantity: 0, totalAmount: 0 },
  });
});

export const addToCartController = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId; 
  const item = req.body;

  const updatedCart = await CartServices.addOrUpdateCartItem(userId, item);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart Add successfully',
    data: updatedCart,
  });
});

export const clearCartController = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId; 

 const result =  await CartServices.clearCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully',
    data:result,
  });
});



export const removeFromCartController = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req?.user?.userId; 

     const { productId } = req.body;
    console.log("productId",productId)

    const cart = await CartServices.removeFromCart(userId, productId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product removed from cart',
      data: cart,
    });
  }
);
export const CartControllers = {
    addToCartController,
    clearCartController,
    getCartController,
removeFromCartController
    
}
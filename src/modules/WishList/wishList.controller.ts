import { Request, Response } from 'express';
import { WishListServices } from './wishList.service';
import sendResponse from '../../app/utils/sendResponse';
import catchAsync from '../../app/utils/catchAsync';
import httpStatus from 'http-status'; // ✅ recommended for status codes

export const addWishlistItem = catchAsync(async (req: Request, res: Response) => {

  const { productId } = req.body;
  const userId = req?.user?.userId;

  const result = await WishListServices.addToWishlist(userId, productId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product added to wishlist',
    data: result,
  });
});

export const deleteWishlistItem = catchAsync(async (req: Request, res: Response) => {

  const { productId } = req.params;

  const userId = req?.user?.userId;
  const result = await WishListServices.removeFromWishlist(userId, productId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Item not found in wishlist',
      data:result
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product removed from wishlist',
    data: result,
  });
});

export const getUserWishlist = catchAsync(async (req: Request, res: Response) => {

  const userId = req?.user?.userId;

  const result = await WishListServices.getWishlistByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});



export const WishlistControllers = {
    addWishlistItem,
    deleteWishlistItem,
    getUserWishlist,
    
}
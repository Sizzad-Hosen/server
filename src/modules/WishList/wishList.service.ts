
import { Types } from 'mongoose';
import { IWishlist } from './wishList.interface';
import { WishlistModel } from './wishList.model';

export const addToWishlist = async (userId: string, productId: string): Promise<IWishlist> => {

    const wishlistItem = await WishlistModel.create({ user: userId, product: productId });

    return wishlistItem;
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<IWishlist | null> => {
    return WishlistModel.findOneAndDelete({ user: userId, product: productId });
};

export const getWishlistByUser = async (userId: string): Promise<IWishlist[]> => {
    return WishlistModel.find({ user: userId }).populate('product'); // Populates full product data
};



export const WishListServices = {

    addToWishlist,
    removeFromWishlist,
    getWishlistByUser
}
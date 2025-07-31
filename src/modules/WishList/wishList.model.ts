
import { model, Schema } from "mongoose";
import { IWishlist } from "./wishList.interface";

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  {
    timestamps: true,
  }
);

export const WishlistModel = model<IWishlist>('Wishlist', wishlistSchema);
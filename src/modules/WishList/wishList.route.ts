
import express from 'express';
import { WishlistControllers } from './wishList.controller';
import auth from '../../app/middlewares/auth';
import { IWishlist } from './wishList.interface';

const router = express.Router();

router.post('/add', auth(), WishlistControllers.addWishlistItem);

router.get('/', auth(), WishlistControllers.getUserWishlist);



router.delete('/:productId',auth(), WishlistControllers.deleteWishlistItem);


export const WishListRoutes = router ;
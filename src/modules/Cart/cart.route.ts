import express from 'express';
import { CartControllers } from './cart.controller';
import auth from '../../app/middlewares/auth';

const router = express.Router();


router.get('/',auth(), CartControllers.getCartController);


router.post('/add', auth(), CartControllers.addToCartController);


router.post('/clear',auth(),  CartControllers.clearCartController);

router.delete('/remove',auth(), CartControllers.removeFromCartController);

router.post('/update',auth(), CartControllers.updateCartItemController);

router.post('/checkout',auth(), CartControllers.checkoutCartController);


export const CartRoutes = router;

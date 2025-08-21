import express from 'express';
import { CartControllers } from './cart.controller';
import auth from '../../app/middlewares/auth';
import validateRequest from '../../app/middlewares/validateRequest';
import { CartValidationSchemas } from './cart.validation';

const router = express.Router();


router.get('/',auth(), CartControllers.getCartController);


router.post('/add', auth(),validateRequest(CartValidationSchemas.addToCartSchema), CartControllers.addToCartController);


router.post('/clear',auth(),  CartControllers.clearCartController);

router.delete('/remove/:productId',auth(), CartControllers.removeFromCartController);

router.patch('/update/:productId', auth(), CartControllers.updateCartItemController);


router.post('/checkout',auth(), CartControllers.checkoutCartController);


export const CartRoutes = router;

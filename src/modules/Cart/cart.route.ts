// routes/cart.route.ts
import express from 'express';
import { CartValidationSchemas } from './cart.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { CartControllers } from './cart.controller';
import auth from '../../app/middlewares/auth';

const router = express.Router();


router.post(
  '/add',
  auth(), 
  validateRequest(CartValidationSchemas.addToCartSchema),
CartControllers.addToCartController
);


router.post(
  '/remove',
  auth(),
  validateRequest(CartValidationSchemas.removeFromCartSchema),
  CartControllers.removeFromCartController
);

router.get(
  '/',
  auth(),
  CartControllers.getCartController
);

router.post(
  '/checkout',
  auth(),
  CartControllers.checkoutCartController
);

export const CartRoutes = router;

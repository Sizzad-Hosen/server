import express from 'express';
import { CartControllers } from './cart.controller';
import auth from '../../app/middlewares/auth';

const router = express.Router();


router.get('/:userId',auth(), CartControllers.getCartController);


router.post('/add', auth(), CartControllers.addToCartController);


router.post('/:userId/clear',auth(),  CartControllers.clearCartController);

export const CartRoutes = router;

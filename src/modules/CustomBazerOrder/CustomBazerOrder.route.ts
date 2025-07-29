import express from 'express';
import { CustomBazerOrderControllers } from './CustomBazerOrder.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { CustomBazerOrderValidationSchemas } from './CustomBazerOrder.validation';
import auth from '../../app/middlewares/auth';

const router = express.Router();

router.post(
'/create-customBazerOrder',
auth(),
validateRequest(CustomBazerOrderValidationSchemas.createCustomBazerOrder),
CustomBazerOrderControllers.createOrderController
);

router.get('/', CustomBazerOrderControllers.getOrdersController);

router.get('/:id', CustomBazerOrderControllers.getSingleOrderController);

export const CustomBazerOrderRoutes = router;
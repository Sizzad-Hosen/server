import express from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { CustomerValidationSchema } from '../Customers/customer.validation';
import { CustomBazerProductControllers } from '../CustomBazerProduct/customBazerProduct.controller';

const router = express.Router();

router.post('/create-customBazerProduct',validateRequest(CustomerValidationSchema.CreateCustomerValidation), 

CustomBazerProductControllers.CreateProductController);

router.get('/', CustomBazerProductControllers.AllProductsController);

export const CustomBazerrouters = router;


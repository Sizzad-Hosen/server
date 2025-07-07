
import express from "express";
import { CustomerControllers } from "./customer.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { CustomerValidationSchema } from "./customer.validation";
import auth from "../../app/middlewares/auth";


const router = express.Router();


router.post('/create-customer',
    auth()
    ,
    validateRequest(CustomerValidationSchema.CreateCustomerValidation)
    ,

    CustomerControllers.createCustomerController)

router.get('/:id', CustomerControllers.getSingelCustomerController)

router.put('/:id',
    validateRequest(CustomerValidationSchema.UpdateCustomerValidation)
    ,
    CustomerControllers.updateCustomerController);

export const CustomerRoutes = router;
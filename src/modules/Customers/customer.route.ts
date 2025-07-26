
import express from "express";
import { CustomerControllers } from "./customer.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { CustomerValidationSchema } from "./customer.validation";
import auth from "../../app/middlewares/auth";
import { upload } from "../../app/utils/sendImageToCloudinary";


const router = express.Router();

router.post('/create-customer',
    auth()
    ,
// upload.array('file')
    
    validateRequest(CustomerValidationSchema.CreateCustomerValidation)
    ,

    CustomerControllers.createCustomerController)

router.patch(
  '/:id',
  auth(),
   
    validateRequest(CustomerValidationSchema.UpdateCustomerValidation),
  CustomerControllers.updateCustomerController
);

router.get(
  '/:id',
  auth(),
  CustomerControllers.getSingleCustomerController
);



export const CustomerRoutes = router;
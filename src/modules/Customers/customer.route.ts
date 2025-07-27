
import express, { NextFunction, Request, Response } from "express";
import { CustomerControllers } from "./customer.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { CustomerValidationSchema } from "./customer.validation";
import auth from "../../app/middlewares/auth";
import { upload } from "../../app/utils/sendImageToCloudinary";


const router = express.Router();

router.post('/create-customer',
    auth()
    ,
 upload.single('file'), 
 
 (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
    
    validateRequest(CustomerValidationSchema.CreateCustomerValidation)
    ,

    CustomerControllers.createCustomerController)

router.patch(
  '/:id',
  auth(),
   upload.single('file'), 
 
 (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
   
    validateRequest(CustomerValidationSchema.UpdateCustomerValidation),
  CustomerControllers.updateCustomerController
);

router.get(
  '/customerDetails',
  auth(),
  CustomerControllers.getSingleCustomerController
);



export const CustomerRoutes = router;
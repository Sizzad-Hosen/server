import validateRequest from "../../app/middlewares/validateRequest";

import  express, { NextFunction, Request, Response }  from "express";

import { ProductControllers } from "./product.controller";
import { ProductsValidationSchemas } from "./product.validation";
import { upload } from "../../app/utils/sendImageToCloudinary";
import auth from "../../app/middlewares/auth";

const router = express.Router();


router.post('/create-product',
  auth("admin"),

       upload.array('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

    validateRequest(ProductsValidationSchemas.createProductSchema),
ProductControllers.createProductController)

router.get('/',ProductControllers.getAllProductsController)

router.get('/sub-products',ProductControllers.getRecentProductsInSub)

router.get('/:id',auth("admin","customer"),ProductControllers.getProductByIdController)

router.patch('/:id', auth("admin"),
       upload.array('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },ProductControllers.updateProductController)

router.delete('/:id',auth("admin"),ProductControllers.deleteProductController)

export const ProductRoutes = router;

   

import validateRequest from "../../app/middlewares/validateRequest";

import  express, { NextFunction, Request, Response }  from "express";

import { ProductControllers } from "./product.controller";
import { ProductsValidationSchemas } from "./product.validation";
import { upload } from "../../app/utils/sendImageToCloudinary";

const router = express.Router();


router.post('/create-product',

       upload.array('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },

    validateRequest(ProductsValidationSchemas.createProductSchema),
ProductControllers.createProductController)

router.get('/',ProductControllers.getAllProductsController)

router.get('/:id',ProductControllers.getProductByIdController)
router.put('/:id',ProductControllers.updateProductController)
router.delete('/:id',ProductControllers.deleteProductController)

export const ProductRoutes = router;

   

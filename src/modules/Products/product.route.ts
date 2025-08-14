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


// Get all products
router.get('/', ProductControllers.getAllProductsController);

// Get recent sub-products
router.get('/sub-products', ProductControllers.getRecentProductsInSub);

// Get single product by ID
router.get('/:id', auth("admin","customer"), ProductControllers.getProductByIdController);

// Update product by ID
router.patch('/:id', auth("admin"), ProductControllers.updateProductController);

// Delete product by ID
router.delete('/:id', auth("admin"), ProductControllers.deleteProductController);

export const ProductRoutes = router;

   

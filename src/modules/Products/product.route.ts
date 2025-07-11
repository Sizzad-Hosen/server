import validateRequest from "../../app/middlewares/validateRequest";

import  express  from "express";

import { ProductControllers } from "./product.controller";
import { ProductsValidationSchemas } from "./product.validation";

const router = express.Router();


router.post('/create-product',validateRequest(ProductsValidationSchemas.createProductSchema),
ProductControllers.createProductController)

router.get('/',ProductControllers.getAllProductsController)

router.get('/:id',ProductControllers.getProductByIdController)
router.put('/:id',ProductControllers.updateProductController)
router.delete('/:id',ProductControllers.deleteProductController)

export const ProductRoutes = router;

   

import validateRequest from "../../app/middlewares/validateRequest";

import  express  from "express";
import { ProductValidationSchemas } from "./product.validation";
import { ProductControllers } from "./product.controller";

const router = express.Router();


router.post('/create-product',validateRequest(ProductValidationSchemas.createProductSchema),
ProductControllers.createProductController)

router.get('/',ProductControllers.getAllProductsController)

router.get('/:id',ProductControllers.getProductByIdController)
router.put('/:id',ProductControllers.updateProductController)
router.delete('/:id',ProductControllers.deleteProductController)

export const ProductRoutes = router;

   

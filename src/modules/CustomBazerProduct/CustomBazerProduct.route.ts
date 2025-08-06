import express from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { CustomBazerProduct } from './customBazerProduct.validation'; // your zod validation schema
import { CustomBazerProductControllers } from './customBazerProduct.controller';

const router = express.Router();

// Create product with validation
router.post(
  '/create-customBazerProduct',
  validateRequest(CustomBazerProduct.CreateProduct), 
  CustomBazerProductControllers.CreateProductController
);

// Get all products
router.get('/', CustomBazerProductControllers.AllProductsController);

// Get single product by id
router.get('/:id', CustomBazerProductControllers.GetProductByIdController);

// Update product by id with validation
router.patch(
  '/:id',
  validateRequest(CustomBazerProduct.CreateProduct), // or create separate UpdateProduct schema
  CustomBazerProductControllers.UpdateProductController
);

// Delete product by id
router.delete('/:id', CustomBazerProductControllers.DeleteProductController);

export const CustomBazerrouters = router;

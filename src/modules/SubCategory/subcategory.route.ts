import express from 'express';
import { SubCategoryValidationSchemas } from './subcategory.validation';
import { SubCategoryControlles } from './subcategory.controller';
import validateRequest from '../../app/middlewares/validateRequest';

const router = express.Router();


router.post(
  '/',
  validateRequest(SubCategoryValidationSchemas.createSubCategorySchema),
  SubCategoryControlles.createSubCategoryController
);


router.get('/', SubCategoryControlles.getAllSubCategoryController);


router.get('/:id', SubCategoryControlles.getSingleSubCategoryController);


router.patch(
  '/:id',
  validateRequest(SubCategoryValidationSchemas.updateSubCategorySchema),
  SubCategoryControlles.updateSubCategoryController
);


router.delete('/:id', SubCategoryControlles.deleteSubCategoryController);

export const SubCategoryRoutes = router;

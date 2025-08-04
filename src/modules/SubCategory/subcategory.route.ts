import express from 'express';
import { SubCategoryValidationSchemas } from './subcategory.validation';
import { SubCategoryControlles } from './subcategory.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import auth from '../../app/middlewares/auth';

const router = express.Router();


router.post(
  '/create-subCategory',
  auth("admin"),
  validateRequest(SubCategoryValidationSchemas.createSubCategorySchema),
  SubCategoryControlles.createSubCategoryController
);


router.get('/',auth("admin","customer"), SubCategoryControlles.getAllSubCategoryController);

router.get('/allProductsBySubId/:subcategoryId',auth("admin","customer"), SubCategoryControlles.getAllProductsBySubcategoryIdController);

router.get("/subcategoryByCategoryId/:categoryId",auth("admin","customer"), SubCategoryControlles.getSubcategoriesByCategoryIdController);

router.get('/:id',auth("admin","customer"), SubCategoryControlles.getSingleSubCategoryController);


router.patch(
  '/:id',
  auth("admin"),
  validateRequest(SubCategoryValidationSchemas.updateSubCategorySchema),
  SubCategoryControlles.updateSubCategoryController
);


router.delete('/:id',auth("admin"), SubCategoryControlles.deleteSubCategoryController);

export const SubCategoryRoutes = router;

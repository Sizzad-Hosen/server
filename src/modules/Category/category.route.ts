import express from 'express';
import { CategoryControllers, createCategoryController } from './category.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { CategoryValidationSchemas } from './category.validation';
import auth from '../../app/middlewares/auth';

const router = express.Router();


router.post('/create-category',  auth("admin"), validateRequest(CategoryValidationSchemas.createCategorySchema),CategoryControllers.createCategoryController);

router.get('/', CategoryControllers.getAllCategoriesController);

router.get('/categoryByServiceId/:serviceId',auth("admin","customer"), CategoryControllers.getCategoriesByServiceIdController);


router.get('/:id',auth("admin","customer"), CategoryControllers.getSingleCategoryController);

router.put('/:id',  auth("admin"), validateRequest(CategoryValidationSchemas.updateCategorySchema), CategoryControllers.updateCategoryController);


router.delete('/:id',  auth("admin"), CategoryControllers.deleteCategoryController);

export const CategoryRoutes = router;

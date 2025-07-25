import express from 'express';
import { CategoryControllers, createCategoryController } from './category.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { CategoryValidationSchemas } from './category.validation';

const router = express.Router();


router.post('/create-category', validateRequest(CategoryValidationSchemas.createCategorySchema),CategoryControllers.createCategoryController);

router.get('/', CategoryControllers.getAllCategoriesController);

router.get('/categoryByServiceId/:serviceId', CategoryControllers.getCategoriesByServiceIdController);


router.get('/:id', CategoryControllers.getSingleCategoryController);
router.put('/:id', validateRequest(CategoryValidationSchemas.updateCategorySchema), CategoryControllers.updateCategoryController);


router.delete('/:id', CategoryControllers.deleteCategoryController);

export const CategoryRoutes = router;

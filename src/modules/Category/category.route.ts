import express from 'express';
import { CategoryControllers, createCategoryController } from './category.controller';

const router = express.Router();


router.post('/create-category', CategoryControllers.createCategoryController);

router.get('/', CategoryControllers.getAllCategoriesController);


router.get('/:id', CategoryControllers.getSingleCategoryController);
router.put('/:id', CategoryControllers.updateCategoryController);


router.delete('/:id', CategoryControllers.deleteCategoryController);

export const CategoryRoutes = router;

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { SubCategoryServices } from './subcategory.service';


export const createSubCategoryController = catchAsync(async (req: Request, res: Response) => {

  const subCategory = await SubCategoryServices.createSubCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: '✅ SubCategory created successfully',
    data: subCategory,
  });
});

export const getAllSubCategoryController = catchAsync(async (_req: Request, res: Response) => {
  const data = await SubCategoryServices.getAllSubCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '📦 All SubCategories fetched',
    data,
  });
});

export const getSingleSubCategoryController = catchAsync(async (req: Request, res: Response) => {

    const {id} = req.params;

  const data = await SubCategoryServices.getSingleSubCategory(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '📦 SubCategory fetched',
    data,
  });
});

export const updateSubCategoryController = catchAsync(async (req: Request, res: Response) => {
     const {id} = req.params;
  const data = await SubCategoryServices.updateSubCategory(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '✏️ SubCategory updated successfully',
    data,
  });
});

export const deleteSubCategoryController = catchAsync(async (req: Request, res: Response) => {
     const {id} = req.params;
  const data = await SubCategoryServices.deleteSubCategory(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '🗑️ SubCategory deleted successfully',
    data,
  });
});


export const getSubcategoriesByCategoryIdController = catchAsync(async (req: Request, res: Response) => {

  const { categoryId } = req.params;

  const result = await SubCategoryServices.getSubcategoriesByCategoryId(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subcategories fetched by categoryId",
    data: result,
  });
});
export const SubCategoryControlles = {
    createSubCategoryController,
    getAllSubCategoryController,
    getSingleSubCategoryController,
    updateSubCategoryController,
    deleteSubCategoryController,
    getSubcategoriesByCategoryIdController
}
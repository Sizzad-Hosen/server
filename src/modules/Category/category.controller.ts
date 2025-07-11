import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { CategoryServices } from "./category.service";
import { Category } from "./category.model";

export const createCategoryController = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const category = await CategoryServices.createCategory(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

export const getAllCategoriesController = catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoryServices.getAllCategories();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories fetched successfully",
        data: categories,
    });
});

export const getSingleCategoryController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await CategoryServices.getSingelCategory(id)


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});
export const updateCategoryController = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;

    const updatedCategory = await CategoryServices.updateCategory(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    });
});

export const deleteCategoryController = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;
      const result =   await CategoryServices.deleteCategory(id);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Category deleted successfully",
            data:result
        });

});


export const CategoryControllers = {
    createCategoryController,
    getAllCategoriesController,
    updateCategoryController,
    deleteCategoryController,
    getSingleCategoryController
}
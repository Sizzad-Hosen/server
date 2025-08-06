import { Request, Response } from 'express';
import { CustomBazerProductServices } from './customBazerProduct.service';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from "http-status";

export const CreateProductController = async (req: Request, res: Response) => {

    const product = await CustomBazerProductServices.createProduct(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Custom Bazer Product Created Successfully",
      data: product,
    });
 
};

export const AllProductsController = async (req: Request, res: Response) => {

    const { category, subcategory } = req.query;
    const products = await CustomBazerProductServices.getAllProducts({
      category: category?.toString(),
      subcategory: subcategory?.toString(),
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Custom Bazer Products fetched successfully",
      data: products,
    });

};

export const GetProductByIdController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const product = await CustomBazerProductServices.getProductById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Custom Bazer Product fetched successfully",
      data: product,
    });
 
};

export const UpdateProductController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const updatedProduct = await CustomBazerProductServices.updateProduct(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Custom Bazer Product updated successfully",
      data: updatedProduct,
    });

};

export const DeleteProductController = async (req: Request, res: Response) => {

    const { id } = req.params;
    const deletedProduct = await CustomBazerProductServices.deleteProduct(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Custom Bazer Product deleted successfully",
      data: deletedProduct,
    });
  
  
};

export const CustomBazerProductControllers = {
  CreateProductController,
  AllProductsController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
};

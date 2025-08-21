import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { ProductServices } from "./product.service";
import { IProduct } from "./product.interface";

// CREATE PRODUCT
export const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const payload: IProduct = req.body;
    
    console.log("file",req.files);

    const result = await ProductServices.createProduct(payload, req.files);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }
);

export const getProductByIdController = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params;

    const product = await ProductServices.getSingelProduct(id);

    if (!product) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  }
);

export const getAllProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await ProductServices.getAllProducts(query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products retrieved successfully",
     
      data:{
         data:result.data,
         meta:result.meta
        }
    });
  }
);

export const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await ProductServices.updateProduct(id, payload, req.files);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  }
);


export const deleteProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProductServices.deleteProduct(id);

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  }
);


const getRecentProductsInSub = catchAsync(async (req: Request, res: Response) => {
  // Parse pagination query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Pass page and limit to service
  const data = await ProductServices.getRecentProductsBySubcategory(page, limit);
console.log(data)
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recent products retrieved successfully',
    data:{
       data:data.data,
       meta: data?.meta,
    }
    
  });
});

export const ProductControllers = {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    getRecentProductsInSub
}
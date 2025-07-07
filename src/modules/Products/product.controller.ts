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

    const result = await ProductServices.createProduct(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }
);


export const ProductControllers = {
    createProductController
}
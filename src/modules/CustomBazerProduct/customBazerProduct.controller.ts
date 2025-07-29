import { Request, Response } from 'express';
import { CustomBazerProductServices } from './customBazerProduct.service';
import sendResponse from '../../app/utils/sendResponse';
import httpStatus from "http-status";



export const CreateProductController = async (req: Request, res: Response) => {

const product = await CustomBazerProductServices.createProduct(req.body);

sendResponse(res,({
    statusCode:httpStatus.OK,
    success:true,
   message:"Custom Bazer Product Create Sucessfully",
   data:product
}))

}

export const AllProductsController = async (req: Request, res: Response) => {

const { category, subcategory } = req.query;

const products = await CustomBazerProductServices.getAllProducts({

category: category?.toString(),
subcategory: subcategory?.toString(),



});

sendResponse(res,({
    statusCode:httpStatus.OK,
    success:true,
   message:"Custom Bazer Product Create Sucessfully",
   data:products
}))

}


export const CustomBazerProductControllers = {

    CreateProductController,
    AllProductsController
    
}
import { TCustomProduct } from "./customBazerProduct.interface";
import {  CustomBazerProductModel } from "./customBazerProduct.model";



export const createProduct = async (data: TCustomProduct) => {

const product = await CustomBazerProductModel.create(data);

return product;

};

export const getAllProducts = async (query: {
category?: string;
subcategory?: string;
}) => {

const filter: any = {};

if (query.category) filter.category = query.category;

if (query.subcategory) filter.subcategory = query.subcategory;


const products = await CustomBazerProductModel.find(filter);

return products;

};


export const CustomBazerProductServices = {
    createProduct,
    getAllProducts
}
import { TCustomProduct } from "./customBazerProduct.interface";
import { CustomBazerProductModel } from "./customBazerProduct.model";
import { Types } from "mongoose";

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

export const getProductById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid product ID");
  const product = await CustomBazerProductModel.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProduct = async (id: string, data: Partial<TCustomProduct>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid product ID");
  const updatedProduct = await CustomBazerProductModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct) throw new Error("Product not found");
  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid product ID");
  const deletedProduct = await CustomBazerProductModel.findByIdAndDelete(id);
  if (!deletedProduct) throw new Error("Product not found");
  return deletedProduct;
};

export const CustomBazerProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

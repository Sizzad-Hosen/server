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
  page?: number;
  limit?: number;
}) => {
  const filter: any = {};
  if (query.category) filter.category = query.category;
  if (query.subcategory) filter.subcategory = query.subcategory;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await CustomBazerProductModel.countDocuments(filter);

  const totalPages = Math.ceil(total / limit);

  const products = await CustomBazerProductModel.find(filter)
    .skip(skip)
    .limit(limit);

  return {
    data:products,
    meta:{
      total,
      page,
      limit,
      totalPages

    }
  };
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

import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import { Types } from "mongoose";

const createCategory = async (payload: TCategory) => {

  const category = await Category.create(payload);
  
  return category;
};

const getAllCategories = async () => {
  return Category.find().populate('serviceId');
};

const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid category ID");
  }
  const updatedCategory = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!updatedCategory) throw new Error("Category not found");
  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid category ID");
  }
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new Error("Category not found");
  return deleted;
};

const  getSingelCategory = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid category ID");
  }

  const category = await Category.findById(id).populate("serviceId");

  if (!category) throw new Error("Category not found");

  return category;
};


const getCategoriesByServiceId = async (serviceId: string) => {
  
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error("Invalid service ID");
  }

  const categories = await Category.find({ serviceId }).populate('serviceId');

  return categories;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getSingelCategory,
  getCategoriesByServiceId, // <-- Add here
};

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

export const CategoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};


import { Types } from 'mongoose';
import { TSubCategory } from './subcategory.interface';
import { SubCategory } from './subcategory.model';

const createSubCategory = async (payload: TSubCategory) => {
  const subCategory = await SubCategory.create(payload);
  return subCategory;
};

const getAllSubCategories = async () => {
  return SubCategory.find().populate(['categoryId', 'serviceId']);
};

const getSingleSubCategory = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid SubCategory ID');

  const subCategory = await SubCategory.findById(id).populate(['categoryId', 'serviceId']);
  
  if (!subCategory) throw new Error('SubCategory not found');
  return subCategory;
};

const updateSubCategory = async (id: string, payload: Partial<TSubCategory>) => {
  const updated = await SubCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(['categoryId', 'serviceId']);
  if (!updated) throw new Error('SubCategory not found');
  return updated;
};

const deleteSubCategory = async (id: string) => {
  const result = await SubCategory.findByIdAndDelete(id);
  if (!result) throw new Error('SubCategory not found');
  return result;
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

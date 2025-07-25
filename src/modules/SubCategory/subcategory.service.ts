
import mongoose, { Types } from 'mongoose';
import { TSubCategory } from './subcategory.interface';
import { SubCategory } from './subcategory.model';
import Product from '../Products/product.model';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { productSearchableField } from '../Products/product.constance';

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


const getSubcategoriesByCategoryId = async (categoryId: string) => {
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  const subcategories = await SubCategory.find({ categoryId }).populate('categoryId');
  return subcategories;
};

export const getAllProductsBySubcategoryId = async (subcategoryId: string, query: any) => {
  console.log("subcategoryId", subcategoryId);

  const productQuery = new QueryBuilder(
    Product.find({ subCategoryId: subcategoryId }), // ✅ Fixed here
    query
  )
    .search(productSearchableField)
    .sort()
    .filter()
    .paginate()
    .fields();

  // Populate after all query builder methods
  productQuery.modelQuery = productQuery.modelQuery.populate('subCategoryId');

  await productQuery.countTotal();

  const products = await productQuery.modelQuery;

  console.log("products", products);

  return {
    data: products,
    meta: {
      total: productQuery.total,
      page: productQuery.page,
      limit: productQuery.limit,
      totalPages: productQuery.totalPages,
    },
  };
};



export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubcategoriesByCategoryId,
  getAllProductsBySubcategoryId
};

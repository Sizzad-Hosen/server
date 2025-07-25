import { Types } from "mongoose";
import { Category } from "../Category/category.model";
import Product from "../Products/product.model";
import { SubCategory } from "../SubCategory/subcategory.model";
import { TServices } from "./service.interface";
import { Service } from "./service.model";

const createService = async (payload: TServices) => {
  const service = await Service.create(payload);
  return service;
};
const getAllServices = async () => {
  const service = await Service.find();
  return service;
};

const deleteService = async (id: string) => {
  const service = await Service.deleteOne({ _id: id });
  return service;
};

const updateService = async (id: string, payload: Partial<TServices>) => {
  const service = await Service.findByIdAndUpdate(id, payload, { new: true });
  return service;
};


const getServiceFullTree = async (serviceId: string) => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error("Invalid service ID");
  }

  // Step 1: Get all categories under the service
  const categories = await Category.find({ serviceId });

  // Step 2: For each category, get its subcategories and their products
  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const subcategories = await SubCategory.find({ categoryId: category._id });

      const subcategoryData = await Promise.all(
        subcategories.map(async (subcategory) => {
          const products = await Product.find({ subcategoryId: subcategory._id });

          return {
            subcategory,
            products,
          };
        })
      );

      return {
        category,
        subcategories: subcategoryData,
      };
    })
  );

  return {
    serviceId,
    categories: categoryData,
  };
};

export const ServiceServices = {
  createService,
  deleteService,
  updateService,
  getAllServices,
  getServiceFullTree
};

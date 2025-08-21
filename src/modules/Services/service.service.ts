import { Types } from "mongoose";
import { Category } from "../Category/category.model";
import Product from "../Products/product.model";
import { SubCategory } from "../SubCategory/subcategory.model";
import { TServices } from "./service.interface";
import { Service } from "./service.model";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { productSearchableField } from "../Products/product.constance";
import { getAllProductsBySubcategoryId } from "../SubCategory/subcategory.service";

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

export const getServiceFullTree = async (serviceId: string, query: any) => {
  if (!Types.ObjectId.isValid(serviceId)) throw new Error("Invalid service ID");

  const categories = await Category.find({ serviceId });

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const subcategories = await SubCategory.find({ categoryId: category._id });

      const subcategoryData = await Promise.all(
        subcategories.map(async (subcategory) => {
          
          // Use your existing service to get products with pagination/meta
          const productsWithMeta = await getAllProductsBySubcategoryId(subcategory._id.toString(), query);

          return {
            subcategory,
            products: productsWithMeta.data, // rename data -> products
            meta: productsWithMeta.meta
          };
        })
      );

      return {
        category,
        subcategories: subcategoryData
      };
    })
  );

  return {
    serviceId,
    categories: categoryData
  };
};

const getSingelService = async (id: string) => {


  const service = await Service.findById(id);

  return service;

}

export const ServiceServices = {
  createService,
  deleteService,
  updateService,
  getAllServices,
  getServiceFullTree,
  getSingelService
};

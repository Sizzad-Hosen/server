import QueryBuilder from "../../app/builder/QueryBuilder";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import { Category } from "../Category/category.model";
import { Service } from "../Services/service.model";
import { TSubCategory } from "../SubCategory/subcategory.interface";
import { SubCategory } from "../SubCategory/subcategory.model";
import { IGenericResponse, productSearchableField } from "./product.constance";
import { IProduct } from "./product.interface";
import Product from "./product.model";


// ====================== CREATE PRODUCT ======================
export const createProduct = async (payload: IProduct, files?: any) => {
  // ✅ 1. Check Service Exists
  const service = await Service.findById(payload.serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  // ✅ 2. Check Category Exists
  const category = await Category.findById(payload.categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // ✅ 3. Check SubCategory Exists
  const subCategory = await SubCategory.findById(payload.subCategoryId);
  if (!subCategory) {
    throw new Error("Subcategory not found");
  }

  // ✅ 4. Upload images to Cloudinary if provided
  const uploadedImages: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const imageName = `${Date.now()}-${file.originalname}`;
      const { secure_url } = await sendImageToCloudinary(imageName, file.path);
      uploadedImages.push(secure_url);
    }
  }

  // ✅ 5. Add images + default discount if not set
  if (uploadedImages.length > 0) {
    payload.images = uploadedImages;
  }
  if (payload.discount === undefined) {
    payload.discount = 0;
  }

  // ✅ 6. Create Product
  const product = await Product.create(payload);
  return product;
};


// ====================== GET ALL PRODUCTS ======================
const numericFields = ["quantity", "price", "discount"];

const getAllProducts = async (
  filters: Record<string, unknown>
): Promise<IGenericResponse<IProduct[]>> => {
  const sanitizedFilters = { ...filters };

  // ✅ sanitize numeric fields
  numericFields.forEach((field) => {
    if (sanitizedFilters[field] !== undefined) {
      const value = sanitizedFilters[field];
      if (typeof value === "string") {
        const parsed = Number(value);
        if (!isNaN(parsed)) {
          sanitizedFilters[field] = parsed;
        } else {
          delete sanitizedFilters[field];
        }
      }
    }
  });

  const queryBuilder = new QueryBuilder<IProduct>(
    Product.find().populate("serviceId categoryId subCategoryId"),
    sanitizedFilters
  );

  queryBuilder.search(productSearchableField);
  queryBuilder.filter();
  queryBuilder.sort();
  queryBuilder.paginate();
  queryBuilder.fields();
  await queryBuilder.countTotal();

  const data = await queryBuilder.modelQuery;
  return {
    meta: {
      page: queryBuilder.page,
      limit: queryBuilder.limit,
      total: queryBuilder.total,
      totalPages: queryBuilder.totalPages,
    },
    data,
  };
};


// ====================== UPDATE PRODUCT ======================
export const updateProduct = async (id: string, payload: IProduct, files?: any) => {
  // Handle image uploads if files provided
  if (files && files.length > 0) {
    const uploadedImages: string[] = [];
    for (const file of files) {
      const imageName = `${Date.now()}-${file.originalname}`;
      const { secure_url } = await sendImageToCloudinary(imageName, file.path);
      uploadedImages.push(secure_url);
    }

    // Merge uploaded images with existing ones if needed
    payload.images = uploadedImages;
  }

  // Ensure sizes array is valid
  if (payload.sizes) {
    payload.sizes = payload.sizes.map(size => ({
      label: size.label,
      price: Number(size.price),
    }));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: payload }, // use $set to replace fields properly
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  return updatedProduct;
};


// ====================== DELETE PRODUCT ======================
const deleteProduct = async (id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  return deletedProduct;
};


// ====================== GET SINGLE PRODUCT ======================
const getSingelProduct = async (id: string) => {
  const product = await Product.findById(id).populate(
    "serviceId categoryId subCategoryId"
  );
  return product;
};


// ====================== GET RECENT PRODUCTS BY SUBCATEGORY ======================
export interface SubcategoryProducts {
  subcategory: TSubCategory;
  products: IProduct[];
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getRecentProductsBySubcategory = async (
  page = 1,
  limit = 10
): Promise<PaginatedResult<IProduct>> => {
  // Fetch all subcategories
  const subcategories = await SubCategory.find().lean<{ _id: string }[]>();

  let allProducts: IProduct[] = [];

  for (const subcat of subcategories) {
    const products = await Product.find({ subCategoryId: subcat._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean<IProduct>();

    allProducts = allProducts.concat(products);
  }

  // Sort all products by creation date
  allProducts.sort(
    (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
  );

  const total = allProducts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedProducts = allProducts.slice(start, end);

  return {
    data: paginatedProducts,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};


// ====================== EXPORT SERVICES ======================
export const ProductServices = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingelProduct,
  getRecentProductsBySubcategory,
};

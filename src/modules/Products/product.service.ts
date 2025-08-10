import QueryBuilder from "../../app/builder/QueryBuilder";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import { Category } from "../Category/category.model";
import { Service } from "../Services/service.model";
import { TSubCategory } from "../SubCategory/subcategory.interface";
import { SubCategory } from "../SubCategory/subcategory.model";
import { IGenericResponse, productSearchableField } from "./product.constance";
import { IProduct } from "./product.interface";
import Product from "./product.model";

export const createProduct = async (payload: IProduct, files?:any) => {

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

  console.log("upload image", uploadedImages)

  if (files && files.length > 0) {
    for (const file of files) {
      const imageName = `${Date.now()}-${file.originalname}`;
      console.log("image name", imageName)

      const { secure_url } = await sendImageToCloudinary(imageName, file.path);
      console.log("secure url", {secure_url})

      uploadedImages.push(secure_url);

    }
  }

  // ✅ 5. Add images to payload

  if (uploadedImages.length > 0) {
    payload.images = uploadedImages;
  }

  // ✅ 6. Create Product
  const product = await Product.create(payload);
  console.log("product created", product)

  return product;
};

const numericFields = ['quantity', 'price'];

const getAllProducts = async (
  filters: Record<string, unknown>
): Promise<IGenericResponse<IProduct[]>> => {
  // Create a shallow copy to avoid mutating the original filters
  const sanitizedFilters = { ...filters };

  // Sanitize numeric fields: convert valid numeric strings to numbers, remove invalid
  numericFields.forEach(field => {
    if (sanitizedFilters[field] !== undefined) {
      const value = sanitizedFilters[field];
      if (typeof value === 'string') {
        const parsed = Number(value);
        if (!isNaN(parsed)) {
          sanitizedFilters[field] = parsed;
        } else {
          // Invalid numeric filter - remove it or handle error
          delete sanitizedFilters[field];
          // or throw an error, depending on your app logic
        }
      }
    }
  });

  const queryBuilder = new QueryBuilder<IProduct>(
    Product.find(),
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

const updateProduct = async (id: string, payload: Partial<any>) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    // Throw an error if no product found
    throw new Error('Product not found');
  }

  return updatedProduct;
};

 const deleteProduct= async (id: string) => {

  const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;

  }
 const getSingelProduct= async (id: string) => {

   const product = await Product.findById(id);
    return product;

  }

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
  // Get all subcategories
  const subcategories = await SubCategory.find().lean();

  // Array to hold all products from all subcategories (2 each)
  let allProducts: IProduct[] = [];

  for (const subcat of subcategories) {
    const products = await Product.find({ subCategoryId: subcat._id })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    allProducts = allProducts.concat(products);
  }

  // Sort allProducts by createdAt descending
  allProducts.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  // Pagination logic (slice array)
  const total = allProducts.length;
  console.log(total)
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


export const ProductServices = {

    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getSingelProduct,
    getRecentProductsBySubcategory

}
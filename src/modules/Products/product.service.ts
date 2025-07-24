import QueryBuilder from "../../app/builder/QueryBuilder";
import { sendImageToCloudinary } from "../../app/utils/sendImageToCloudinary";
import { Category } from "../Category/category.model";
import { Service } from "../Services/service.model";
import { SubCategory } from "../SubCategory/subcategory.model";
import { productSearchableField } from "./product.constance";
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

const getAllProducts = async(query: any)=>{
    const productQuery = new QueryBuilder(Product.find(),query)
    .search(productSearchableField)
    .sort()
    .filter()
    .paginate()
    .fields()
    await productQuery.countTotal();


    const products = await productQuery.modelQuery;

    return {
        data:products,
        meta:{
            total:productQuery.total,
            page:productQuery.page,
            limit:productQuery.limit,
            totalPages:productQuery.totalPages
        }
    }
}
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

export const ProductServices = {

    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getSingelProduct

}
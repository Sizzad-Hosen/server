import QueryBuilder from "../../app/builder/QueryBuilder";
import { productSearchableField } from "./product.constance";
import { IProduct } from "./product.interface";
import Product from "./product.model";

const createProduct = async(payload:IProduct)=>{

    const product = await Product.create(payload);
    return product;

}

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
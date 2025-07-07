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

export const ProductServices = {

    createProduct,
    getAllProducts

}
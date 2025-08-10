import mongoose, { Schema, model, models, Types } from "mongoose";
import { optional } from "zod";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    
   images: {
  type: [String],
  default: [],
},

    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
   discount: {
      type: Number,
      required: true,
      min: [0, "DiscountPrice must be positive"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be positive"],
    },

   
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, "Service ID is required"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, "Category ID is required"],
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: [true, "SubCategory ID is required"],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Product = models.Product || model("Product", ProductSchema);
export default Product;

import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: {
      type: [String], // array of image URLs
      required: true,
      validate: (val: string[]) => val.length > 0,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be positive"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
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

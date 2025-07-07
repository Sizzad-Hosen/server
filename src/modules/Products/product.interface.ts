export interface IProduct {
  title: string;
  description: string;
  images: string[]; // multiple image URLs
  price: number;
  quantity: number;
  category: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

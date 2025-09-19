export interface TSubcategory {
  name: string;
  unit: 'kg' | 'gm' | 'piece' | 'litre';
  pricePerUnit: number;
  size?:string
}

export interface TCustomProduct extends Document {
  category: string;
  subcategories: TSubcategory[];
}

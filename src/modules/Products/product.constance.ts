


export const productSearchableField = [
  'title','price','category','name','quantity',
]
export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
}

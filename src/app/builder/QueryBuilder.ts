import { FilterQuery, Query } from "mongoose";
import { fieldToDbPathMap } from "./constance";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  public total: number = 0;
  public page: number = 1;
  public limit: number = 10;
  public totalPages: number = 1;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(field => {
          const dbField = fieldToDbPathMap[field] || field;
          return {
            [dbField]: { $regex: searchTerm, $options: 'i' },
          };
        }),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    const numberFields = ["price", "quantity"]; // numeric fields here
    const filterConditions: any = {};

    Object.entries(queryObj).forEach(([field, value]) => {
      const dbField = fieldToDbPathMap[field] || field;

      if (typeof value === "string") {
        if (numberFields.includes(field)) {
          // Parse number for numeric fields
          const parsedNum = Number(value);
          if (!isNaN(parsedNum)) {
            filterConditions[dbField] = parsedNum;
          } else {
            // Skip or handle invalid number input
            // You could throw error here if needed
          }
        } else {
          // String fields use regex for partial & case-insensitive match
          filterConditions[dbField] = { $regex: value, $options: "i" };
        }
      } else {
        // For non-string (number, boolean), exact match
        filterConditions[dbField] = value;
      }
    });

    this.modelQuery = this.modelQuery.find(filterConditions);
    return this;
  }

  sort() {
    const sort =
      (this.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    this.page = Number(this.query?.page) || 1;
    this.limit = Number(this.query?.limit) || 10;

    const skip = (this.page - 1) * this.limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(this.limit);
    return this;
  }

  fields() {
    const fields =
      (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const filters = this.modelQuery.getFilter();
    this.total = await this.modelQuery.model.countDocuments(filters);
    this.totalPages = Math.ceil(this.total / this.limit);
    return this;
  }
}

export default QueryBuilder;

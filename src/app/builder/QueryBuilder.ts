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
    // Trim all string values in query
    const sanitizedQuery: Record<string, unknown> = {};
    for (const key in query) {
      const val = query[key];
      sanitizedQuery[key] =
        typeof val === "string" ? val.trim() : val;
    }

    this.modelQuery = modelQuery;
    this.query = sanitizedQuery;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;
    if (searchTerm) {
      const trimmed = searchTerm.trim();
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(field => {
          const dbField = fieldToDbPathMap[field] || field;
          return {
            [dbField]: { $regex: trimmed, $options: 'i' },
          };
        }),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    const numberFields = ["price", "quantity"]; // add more as needed
    const filterConditions: Record<string, any> = {};

    Object.entries(queryObj).forEach(([field, value]) => {
      const dbField = fieldToDbPathMap[field] || field;

      if (typeof value === "string") {
        const trimmedValue = value.trim();

        if (numberFields.includes(field)) {
          const parsedNum = Number(trimmedValue);
          if (!isNaN(parsedNum)) {
            filterConditions[dbField] = parsedNum;
          }
        } else {
          // Use regex for partial string match
          filterConditions[dbField] = {
            $regex: trimmedValue,
            $options: "i",
          };
        }
      } else {
        // Exact match for non-string types
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

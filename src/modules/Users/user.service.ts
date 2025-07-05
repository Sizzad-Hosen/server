import QueryBuilder from "../../app/builder/QueryBuilder";
import { usersSearchableField } from "./user.constance";
import { IUser } from "./user.interface";
import { User } from "./user.model";


const registerUser = async(payload:IUser)=>{

    const result = await User.create(payload);

    return result;

}


const getAllUsers = async (query: Record<string, unknown>) => {

    const usersQuery = new QueryBuilder(User.find(),query)
    .search(usersSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

   await usersQuery.countTotal();
   const users = await usersQuery.modelQuery;

   return {
    data : users,
    meta:{
        total:usersQuery.total,
        page:usersQuery.page,
        limit:usersQuery.limit,
        totalPages:usersQuery.totalPages
    }
   }

};

export const UserServices = {
    registerUser,
    getAllUsers
}
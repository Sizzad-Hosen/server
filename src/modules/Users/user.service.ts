import { IUser } from "./user.interface";
import { User } from "./user.model";


const registerUser = async(payload:IUser)=>{

    const result = await User.create(payload);

    return result;

}



export const UserServices = {
    registerUser
}
import { TShippingAddress } from "./address.interface";
import { ShippingAddressModel } from "./address.model";



export const createAddress = async (payload:TShippingAddress) => {
    

  return await ShippingAddressModel.create(payload);


};

export const getAddressesByUser = async (userId: string) => {
  return await ShippingAddressModel.find({ userId }).sort({ createdAt: -1 });
};

export const deleteAddress = async (id: string) => {
  return await ShippingAddressModel.findByIdAndDelete(id);
};



export const ShippingAddressServices = {
    createAddress,
    getAddressesByUser,
    deleteAddress
}
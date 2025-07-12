import { TShippingAddress } from "./address.interface";
import { ShippingAddressModel } from "./address.model";

export const createAddress = async (payload: TShippingAddress) => {
  return await ShippingAddressModel.create(payload);
};

export const getAddressesByUser = async (userId: string) => {
  return await ShippingAddressModel.find({ userId }).sort({ createdAt: -1 });
};

export const getAddressById = async (id: string) => {
  return await ShippingAddressModel.findById(id);
};

export const updateAddress = async (id: string, payload: Partial<TShippingAddress>) => {
  return await ShippingAddressModel.findByIdAndUpdate(id, payload, {
    new: true,      // return the updated document
    runValidators: true,  // run schema validations
  });
};

export const deleteAddress = async (id: string) => {
  return await ShippingAddressModel.findByIdAndDelete(id);
};

export const ShippingAddressServices = {
  createAddress,
  getAddressesByUser,
  getAddressById,
  updateAddress,
  deleteAddress,
};

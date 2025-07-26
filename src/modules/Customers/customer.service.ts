import httpStatus from 'http-status';
import AppError from '../../app/config/error/AppError';
import { User } from '../Users/user.model';
import { ICustomer } from './customer.interface';
import { Customer } from './customer.model';
import mongoose from 'mongoose';
import { ShippingAddressModel } from '../Address/address.model';


const createOrUpdateCustomer = async (payload: ICustomer, userId: string): Promise<ICustomer> => {
  const gender = payload.gender;
  const profileImage = payload.profileImage;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  let addressId = undefined;

  // Handle address creation or use existing
  if (payload.address) {
    if (typeof payload.address === 'object' && !mongoose.Types.ObjectId.isValid(String(payload.address))) {
      // New address object, create ShippingAddress document
      const newAddress = await ShippingAddressModel.create(payload.address);
      addressId = newAddress._id;
    } else {
      // Existing address ObjectId
      addressId = payload.address as any;
    }
  }

  // Find existing customer by user ID
  const existingCustomer = await Customer.findOne({ user: userId });

  if (existingCustomer) {
    if (gender && ['male', 'female', 'other'].includes(gender)) {
      existingCustomer.gender = gender as 'male' | 'female' | 'other';
    }
    existingCustomer.profileImage = profileImage || existingCustomer.profileImage;
    if (addressId) {
      existingCustomer.address = addressId;
    }

    await existingCustomer.save();
    return existingCustomer;
  } else {
    // Create new customer
    const newCustomer = await Customer.create({
      user: userId,
      gender,
      profileImage,
      address: addressId,
    });

    return newCustomer;
  }
};

export const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>
): Promise<ICustomer> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid customer ID', httpStatus.BAD_REQUEST);
  }

  let addressId;

  // Check and create/update address if needed
  if (payload.address) {
    if (typeof payload.address === 'object' ) {
      // Create new address from object
      const newAddress = await ShippingAddressModel.create(payload.address);
      addressId = newAddress._id;
    } else {
      addressId = payload.address as any;
    }
  }

  // Prepare update data
  const updateData: any = { ...payload };
  if (addressId) {
    updateData.address = addressId;
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone').populate('address');

  if (!updatedCustomer) {
    throw new AppError('Customer not found', httpStatus.NOT_FOUND);
  }

  return updatedCustomer;
};
const getSingleCustomer = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid customer ID', httpStatus.BAD_REQUEST);
  }

  const customer = await Customer.findById(id)
    .populate('user', 'name email phone')
    .populate('address');

  if (!customer) {
    throw new AppError('Customer not found', httpStatus.NOT_FOUND);
  }

  return customer;
};



export const CustomerServices = {
  createOrUpdateCustomer,
  updateCustomer,
  getSingleCustomer,
};

function isValidObjectId(address: mongoose.Types.ObjectId) {
  throw new Error('Function not implemented.');
}

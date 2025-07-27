import httpStatus from 'http-status';
import AppError from '../../app/config/error/AppError';
import { User } from '../Users/user.model';
import { ICustomer } from './customer.interface';
import { Customer } from './customer.model';
import mongoose from 'mongoose';
import { ShippingAddressModel } from '../Address/address.model';
import { sendImageToCloudinary } from '../../app/utils/sendImageToCloudinary';

const createOrUpdateCustomer = async (
  payload: ICustomer,
  userId: string,
  file: any
): Promise<ICustomer> => {

  const gender = payload.gender;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  // ✅ File Upload
  if (file) {
    console.log('[11] Starting file upload...');
    const imageName = `${userId}_${user.name}`;
    console.log('[12] Image name:', imageName);

    const { secure_url } = await sendImageToCloudinary(imageName, file.path);
    console.log('[13] File uploaded successfully:', secure_url);

    payload.profileImage = secure_url;
  }

  let addressId = undefined;

  // Handle address creation or use existing
  if (payload.address) {
    if (
      typeof payload.address === 'object' &&
      !mongoose.Types.ObjectId.isValid(String(payload.address))
    ) {
      const newAddress = await ShippingAddressModel.create(payload.address);
      addressId = newAddress._id;
    } else {
      addressId = payload.address as any;
    }
  }

  // Find existing customer by user ID
  const existingCustomer = await Customer.findOne({ user: userId });

  if (existingCustomer) {
    if (gender && ['male', 'female', 'other'].includes(gender)) {
      existingCustomer.gender = gender as 'male' | 'female' | 'other';
    }

    if (payload.profileImage) {
      existingCustomer.profileImage = payload.profileImage;
    }

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
      profileImage: payload.profileImage,
      address: addressId,
    });

    return newCustomer;
  }
};
export const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>,
  file?: any
): Promise<ICustomer> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid customer ID', httpStatus.BAD_REQUEST);
  }

  const userId = payload.user;

  // ✅ 1. Upload image if file exists
  if (file) {
    console.log('[11] Starting file upload...');
    const imageName = `${userId}_${Date.now()}`; // added timestamp to ensure unique
    const { secure_url } = await sendImageToCloudinary(imageName, file.path);
    console.log('[13] File uploaded successfully:', secure_url);
    payload.profileImage = secure_url;
  }

  // ✅ 2. Handle address creation or linking
  let addressId;
  if (payload.address) {
    if (typeof payload.address === 'object' && !mongoose.Types.ObjectId.isValid(payload.address as any)) {
      const newAddress = await ShippingAddressModel.create(payload.address);
      addressId = newAddress._id;
    } else {
      addressId = payload.address as any;
    }
  }

  // ✅ 3. Prepare update object
  const updateData: any = { ...payload };
  if (addressId) {
    updateData.address = addressId;
  }

  // ✅ 4. Update customer document
  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('user', 'name email phone')
    .populate('address');

  if (!updatedCustomer) {
    throw new AppError('Customer not found', httpStatus.NOT_FOUND);
  }

  return updatedCustomer;
};


export const getSingleCustomerByUserId = async (userId: string) => {

  const customer = await Customer.findOne({ user: userId })

    .populate('user', 'name email phone')
    .populate('address');

  console.log('Customer found:', customer);

  if (!customer) {
    throw new AppError('Customer not found', httpStatus.NOT_FOUND);
  }

  return customer;
};


export const CustomerServices = {
  createOrUpdateCustomer,
  updateCustomer,
  getSingleCustomerByUserId
};


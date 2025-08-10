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
  file?: any
): Promise<ICustomer> => {
  
  const user = await User.findById(userId).lean();

  if (!user) throw new AppError(httpStatus.NOT_FOUND,'User not found');

  // Address handle (as before)
  let addressId;
  if (payload.address) {
    if (typeof payload.address === 'object' && !mongoose.Types.ObjectId.isValid(String(payload.address))) {
      const newAddress = await ShippingAddressModel.create(payload.address);
      addressId = newAddress._id.toString();
    } else {
      addressId = String(payload.address);
    }
  }

  const updateData: Partial<ICustomer> = {
    gender: payload.gender,
    address: addressId,
  };

  if (file) {
    sendImageToCloudinary(`${userId}_${user.name || 'customer'}`, file.path)
      .then(({ secure_url }) => {
        Customer.findOneAndUpdate(
          { user: userId },
          { $set: { profileImage: secure_url } },
          { new: true }
        ).exec();
      })
      .catch(console.error);
  }

  const customer = await Customer.findOneAndUpdate(
    { user: userId },
    { $set: updateData, $setOnInsert: { user: userId } },
    { new: true, upsert: true }
  ).lean();

  return customer as ICustomer;
};



export const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>,
  file?: any
): Promise<ICustomer> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST,'Invalid customer ID', );


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
    throw new AppError(httpStatus.NOT_FOUND,'Customer not found');
  }

  return updatedCustomer;
};


export const getSingleCustomerByUserId = async (userId: string) => {

  console.log("userId service",userId)
  
  const customer = await Customer.findOne({ user: userId })

    .populate('user', 'name email phone')
    .populate('address');

  console.log('Customer found:', customer);

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND,'Customer not found', );
  }

  return customer;
};


export const CustomerServices = {
  createOrUpdateCustomer,
  updateCustomer,
  getSingleCustomerByUserId
};


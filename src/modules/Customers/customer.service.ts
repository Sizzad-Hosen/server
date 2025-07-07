
import httpStatus from 'http-status';
import AppError from '../../app/config/error/AppError';
import { User } from '../Users/user.model';
import { ICustomer } from './customer.interface';
import { CustomerModel } from './customer.model';
import mongoose from 'mongoose';

export const createCustomer = async (
  userId: string,
  payload: Partial<ICustomer>
): Promise<ICustomer> => {
  if (!userId) {
    throw new AppError(400, 'User ID missing from token');
  }

  const user = await User.findById(userId);
  if (!user) {
    
    throw new AppError(404, 'User not found');
  }

  const customer = await CustomerModel.create({
    ...payload,
    user: userId,
  });

  return customer;
};


export const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>
): Promise<ICustomer> => {
  console.log("ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid customer ID format');
  }

  const customer = await CustomerModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  console.log("Result:", customer);

  if (!customer) {
    throw new AppError(404, 'Customer not found');
  }

  return customer;
};

export const getSingelCustomer = async (
  id: string,
) => {


  console.log("ID:", id);

const customer = await CustomerModel.findOne({ _id: id });

  console.log("Result:", customer);

  if (!customer) {
    throw new AppError(404, 'Customer not found');
  }

  return customer;
};


export const CustomerServcies = {
    createCustomer,
    updateCustomer,
    getSingelCustomer
}
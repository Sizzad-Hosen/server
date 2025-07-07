
import httpStatus from 'http-status';
import AppError from '../../app/config/error/AppError';
import { User } from '../Users/user.model';
import { ICustomer } from './customer.interface';
import { CustomerModel } from './customer.model';

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


export const CustomerServcies = {
    createCustomer
}
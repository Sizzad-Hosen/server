import httpStatus from 'http-status';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../app/config/error/AppError';
import { createToken } from './auth.utils';
import config from '../../app/config';

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }


  const isPasswordMatched = await User.isPasswordMatched(password, user.password); 

console.log("Login payload password:", password);
console.log("Stored user password:", user.password); // should be hash
console.log("Password match result:", isPasswordMatched);


  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match!');
  }

  const jwtPayload = {
    userId: (user._id as string | { toString(): string }).toString(),
    role: user.role,
  };


  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices ={
    loginUser

}

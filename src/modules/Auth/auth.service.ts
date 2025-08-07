import httpStatus from 'http-status';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../app/config/error/AppError';
import { createToken, verifyToken } from './auth.utils';
import config from '../../app/config';
import { sendEmail } from '../../app/utils/sendEmail';
import bcrypt from 'bcrypt'

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }


  const isPasswordMatched = await User.isPasswordMatched(password, user.password); 

console.log("Login payload password:", password);
console.log("Stored user password:", user.password);

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


const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user exists
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};


const forgetPassword = async (email: string) => {
  try {
    // ✅ Check if the user exists by email
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    const jwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '10m'
    );


    const resetLink = `${config.reset_pass_ui_link}/${jwtPayload.userId}reset-password?token=${resetToken}`;

    await sendEmail(user.email, resetLink);

    console.log('Reset Password Link:', resetLink);
    return resetLink;
  } catch (error) {
    console.error('Error in forgetPassword:', error);
    throw error;
  }
};
const resetPassword = async (
  payload: { email: string; newPassword: string; oldPassword: string },
  token: string
) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const user = await User.findById(decoded.userId).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (payload.email !== user.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  const isOldPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your old password does not match');
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your new password is the same as the old password. Try a different one.'
    );
  }

  // ✅ Assign plain password
  user.password = payload.newPassword;
  user.set('passwordChangedAt', new Date());

  // ✅ Pre-save hook will hash the password
  await user.save();
};



const getMe = async (token: string) => {
  
  const decoded = verifyToken(token, config.jwt_access_secret as string);
  const { userId } = decoded;

  const user = await User.findById(userId); // ✅ correct way

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  return user;
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  const user = await User.findById(userId).select('+password');
  if (!user || !user.password) {
    throw new Error('User not found or password missing');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }

  user.password = newPassword; // plain password - will be hashed in pre('save')
  
  await user.save();

  return { message: 'Password changed successfully' };
};


export const AuthServices ={
    loginUser,
    refreshToken,
    forgetPassword,
    resetPassword,
    getMe,
    changePassword

}

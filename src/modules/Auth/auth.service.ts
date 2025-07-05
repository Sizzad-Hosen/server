import httpStatus from 'http-status';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../app/config/error/AppError';
import { createToken, verifyToken } from './auth.utils';
import config from '../../app/config';
import { sendEmail } from '../../app/utils/sendEmail';

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
  payload: { email: string; newPassword: string },
  token: string
) => {
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Optional: Verify email matches user for extra safety
  if (payload.email !== user.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });
};


export const AuthServices ={
    loginUser,
    refreshToken,
    forgetPassword

}

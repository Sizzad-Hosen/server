import httpStatus from 'http-status';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../app/config/error/AppError';
import { createToken, verifyToken } from './auth.utils';
import config from '../../app/config';
import { sendEmail } from '../../app/utils/sendEmail';
import bcrypt from 'bcrypt'
import {  Secret } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const start = Date.now();

  // Find user by email (ensure email index exists)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  console.log('DB query time:', Date.now() - start, 'ms');

  const startBcrypt = Date.now();
  // Password comparison
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password!');
  }
  console.log('bcrypt compare time:', Date.now() - startBcrypt, 'ms');

const jwtPayload = {
  userId: user.id,  // string already
  role: user.role,
};

  if (
    !config.jwt_access_secret || 
    !config.jwt_refresh_secret || 
    !config.jwt_access_expires_in || 
    !config.jwt_refresh_expires_in
  ) {
    throw new Error('JWT configuration is not properly set');
  }

  const jwtAccessExpiresIn = config.jwt_access_expires_in || "24h";  // ডিফল্ট
  const jwtRefreshExpiresIn = config.jwt_refresh_expires_in || "7d";  // ডিফল্ট

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as Secret, jwtAccessExpiresIn as SignOptions['expiresIn']);
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as Secret, jwtRefreshExpiresIn as SignOptions['expiresIn']);

  return { accessToken, refreshToken };
};

export default loginUser;

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
  userId: user.id, 
  role: user.role,
};


  const jwtAccessExpiresIn = config.jwt_access_expires_in || "24h";  // ডিফল্ট

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as Secret, jwtAccessExpiresIn as SignOptions['expiresIn']);

  return {
    accessToken,
  };
};

export const forgetPassword = async (email: string) => {
  // 1️⃣ Find user
  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, `User with email ${email} not found`);

  // 2️⃣ Create JWT payload
  const payload = { userId: user.id, role: user.role };

  // 3️⃣ Generate reset token (30m expiry)
  const resetToken = createToken(
    payload,
    config.jwt_access_secret as string,
    (config.jwt_access_expires_in as SignOptions["expiresIn"]) || "30m"
  );

  // 4️⃣ Construct reset link
  const resetLink = `${config.reset_pass_ui_link}/reset-password/${user.id}?token=${resetToken}`;

  // 5️⃣ Fire email async (non-blocking)
  sendEmail(
    user.email,
    "Reset Your Password - Clickei Bazar",
    `<p>Hello ${user.name || "User"},</p>
     <p>Click the link below to reset your password:</p>
     <a href="${resetLink}">${resetLink}</a>
     <p>This link will expire in 30 minutes.</p>`,
    `Reset link: ${resetLink}`
  ).catch(err => {
    console.error("❌ Failed to send reset email:", err);
  });

  console.log(`🔑 Reset link generated for ${email}: ${resetLink}`);

  return { resetLink, userId: user.id };
};
export const resetPassword = async (
  payload: { email: string; oldPassword: string; newPassword: string },
  token: string
) => {
  let decoded;
  try {
    decoded = verifyToken(token, config.jwt_access_secret as string);
  } catch (err: any) {
    if (err.name === "TokenExpiredError") throw new AppError(401, "Reset token has expired");
    throw new AppError(401, "Invalid token");
  }

  const user = await User.findById(decoded.userId).select('+password');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (payload.email !== user.email) throw new AppError(httpStatus.FORBIDDEN, "Email mismatch");

  const isOldPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isOldPasswordMatched) throw new AppError(httpStatus.FORBIDDEN, "Old password does not match");

  if (payload.oldPassword === payload.newPassword)
    throw new AppError(httpStatus.FORBIDDEN, "New password cannot be same as old password");

  // ✅ Assign new password and hash via pre-save hook
  user.password = payload.newPassword;
  user.set("passwordChangedAt", new Date());
  await user.save();

  return { message: "Password reset successfully" };
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

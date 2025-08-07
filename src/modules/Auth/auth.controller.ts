import { ref } from "process";
import config from "../../app/config";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from 'http-status';
import AppError from "../../app/config/error/AppError";

const loginUser = catchAsync(async (req, res) => {

  console.log('body',req.body)
  const result = await AuthServices.loginUser(req.body);
  console.log('res',result)
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
    
    },
  });
});

const refreshToken = catchAsync(async(req,res)=>{

  const {refreshToken} = req.cookies;
  const result =  await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  console.log('Email received:', email);

  const result = await AuthServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link generated successfully!',
    data: result,
  });
});


const resetPassword = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authorization token is missing or invalid');
  }

  const token = authHeader.split(' ')[1]; // ✅ Extract JWT

  const result = await AuthServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {

  const token = req.headers.authorization;

  console.log(" token:", token);

  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found!');
  }

  const accessToken = token.replace(/^Bearer\s/, ''); 

  const result = await AuthServices.getMe(accessToken); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

export const changePasswordController = catchAsync(async (req, res) => {

  const userId = req?.user?.userId;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required');
  }

  const result = await AuthServices.changePassword(userId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });

  
});

export const AuthControllers ={
    loginUser,
    refreshToken,
    forgetPassword,
    resetPassword,
    getMe,
    changePasswordController

}
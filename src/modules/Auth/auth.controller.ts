import { ref } from "process";
import config from "../../app/config";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from 'http-status';

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

export const AuthControllers ={
    loginUser,
    refreshToken,
    forgetPassword

}
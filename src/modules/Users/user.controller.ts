import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { UserServices } from "./user.service";


const registeredUser = catchAsync(async (req: Request, res: Response) => {
  console.log("Received body:", req.body); // Debug log

  const newUser = await UserServices.registerUser(req.body); // Use entire body directly

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created new user",
    data: newUser,
  });
});

const getAllUserController = catchAsync(async (req: Request, res: Response) => {


  const alluser = await UserServices.getAllUsers(req.query); 

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created new user",
     data: {
      data: alluser.data,   // students list
      meta: alluser.meta,   // pagination info
    },
  });
});


export const UserControllers= {
  registeredUser,
  getAllUserController
};

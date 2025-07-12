import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import { ShippingAddressServices } from "./address.service";
import sendResponse from "../../app/utils/sendResponse";

import httpStatus from "http-status"; // npm install http-status

export const createShippingAddress = catchAsync(async (req: Request, res: Response) => {


  const newAddress = await ShippingAddressServices.createAddress(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shipping address created successfully",
    data: newAddress,
  });
});

export const getUserShippingAddresses = catchAsync(async (req: Request, res: Response) => {

  const userId  = req?.user?.userId



  const addresses = await ShippingAddressServices.getAddressesByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping addresses fetched successfully",
    data: addresses,
  });
});

export const deleteShippingAddress = catchAsync(async (req: Request, res: Response) => {
    
  const { id } = req.params;


  const deleted = await ShippingAddressServices.deleteAddress(id);



  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping address deleted successfully",
    data: deleted,
  });
});

export const ShippingAddressControllers = {
  createShippingAddress,
  getUserShippingAddresses,
  deleteShippingAddress,
};

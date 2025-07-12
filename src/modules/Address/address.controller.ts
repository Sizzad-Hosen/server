import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import { ShippingAddressServices } from "./address.service";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";

// Create shipping address
export const createShippingAddress = catchAsync(async (req: Request, res: Response) => {
  const newAddress = await ShippingAddressServices.createAddress(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shipping address created successfully",
    data: newAddress,
  });
});

// Get all shipping addresses for authenticated user (assuming req.user.userId is set)
export const getUserShippingAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized: userId missing",
       data :null,
    });
  }

  const addresses = await ShippingAddressServices.getAddressesByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping addresses fetched successfully",
    data: addresses,
  });
});

// Get a single shipping address by ID
export const getShippingAddressById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const address = await ShippingAddressServices.getAddressById(id);

  if (!address) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Shipping address not found",
       data :null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping address fetched successfully",
    data: address,
  });
});

// Update shipping address by ID
export const updateShippingAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const updatedAddress = await ShippingAddressServices.updateAddress(id, payload);

  if (!updatedAddress) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Shipping address not found",
        data :null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shipping address updated successfully",
    data: updatedAddress,
  });
});

// Delete shipping address by ID
export const deleteShippingAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await ShippingAddressServices.deleteAddress(id);

  if (!deleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Shipping address not found",
       data :null,
    });
  }

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
  getShippingAddressById,
  updateShippingAddress,
  deleteShippingAddress,
};

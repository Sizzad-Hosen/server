import http from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { TServices } from './service.interface';
import { ServiceServices } from './service.service';

// Create Service Controller
export const createServiceController = catchAsync(async (req, res) => {
  const payload: TServices = req.body;

  const newService = await ServiceServices.createService(payload);

  sendResponse(res, {
    statusCode: http.OK,
    success: true,
    message: 'Create new Service Successfully',
    data: newService,
  });
});

// Update Service Controller
export const updateServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload: Partial<TServices> = req.body;

  const updatedService = await ServiceServices.updateService(id, payload);

  sendResponse(res, {
    statusCode: http.OK,
    success: true,
    message: 'Service updated successfully',
    data: updatedService,
  });
});

// Delete Service Controller
export const deleteServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deleted = await ServiceServices.deleteService(id);

  sendResponse(res, {
    statusCode: http.OK,
    success: true,
    message: 'Service deleted successfully',
    data:deleted
  });
});

// Get All Services Controller
export const getAllServicesController = catchAsync(async (req, res) => {
  const services = await ServiceServices.getAllServices();

  sendResponse(res, {
    statusCode: http.OK,
    success: true,
    message: 'Services fetched successfully',
    data: services,
  });
});


export const ServiceControllers = {
    createServiceController,
    getAllServicesController,
    deleteServiceController,
    updateServiceController

}

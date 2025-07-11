import { TServices } from "./service.interface";
import { Service } from "./service.model";

const createService = async (payload: TServices) => {
  const service = await Service.create(payload);
  return service;
};
const getAllServices = async () => {
  const service = await Service.find();
  return service;
};

const deleteService = async (id: string) => {
  const service = await Service.deleteOne({ _id: id });
  return service;
};

const updateService = async (id: string, payload: Partial<TServices>) => {
  const service = await Service.findByIdAndUpdate(id, payload, { new: true });
  return service;
};

export const ServiceServices = {
  createService,
  deleteService,
  updateService,
  getAllServices
};

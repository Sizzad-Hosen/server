import { OrderModel } from "./order.model";

export const generateInvoiceNumber = async (): Promise<number> => {
  const lastOrder = await OrderModel.findOne({}, {}, { sort: { createdAt: -1 } });

  const lastInvoiceNumber = lastOrder?.invoiceNumber || 1000;

  return lastInvoiceNumber + 1;
};

import { OrderModel } from "./order.model";

export const generateInvoiceNumber = async (): Promise<number> => {
  const lastOrder = await OrderModel.findOne({}, {}, { sort: { createdAt: -1 } });

  const lastInvoiceRaw = lastOrder?.invoiceNumber;
  const lastInvoiceNumber = lastInvoiceRaw ? Number(lastInvoiceRaw) : 100000;

  let nextInvoiceNumber = lastInvoiceNumber + 1;

  // Retry if the invoice number already exists
  let exists = await OrderModel.exists({ invoiceNumber: nextInvoiceNumber });

  while (exists) {
    nextInvoiceNumber++;

    if (nextInvoiceNumber.toString().length > 8) {
      nextInvoiceNumber = 100000; // fallback/reset
    }

    exists = await OrderModel.exists({ invoiceNumber: nextInvoiceNumber });
  }

  return nextInvoiceNumber;
};

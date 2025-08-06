import { OrderModel } from "./order.model";

export const generateInvoiceId = async (): Promise<string> => {
  const lastOrder = await OrderModel.findOne({}, {}, { sort: { createdAt: -1 } });

  const lastInvoiceRaw = lastOrder?.invoiceId;

  // Extract number after "O", or start from 100000 if not found
  const lastInvoiceId = lastInvoiceRaw ? parseInt(lastInvoiceRaw.slice(1)) : 100000;

  let nextInvoiceId = lastInvoiceId + 1;

  // Retry if invoiceNumber exists
  let exists = await OrderModel.exists({ invoiceId: `O${nextInvoiceId.toString().padStart(6, '0')}` });

  while (exists) {
    nextInvoiceId++;

    // Reset if number exceeds 999999 (6 digits)
    if (nextInvoiceId > 999999) {
      nextInvoiceId = 100000; // fallback/reset
    }

    exists = await OrderModel.exists({ invoiceId: `O${nextInvoiceId.toString().padStart(6, '0')}` });
  }

  // Return with "O" and zero-padded 6-digit number
  return `O${nextInvoiceId.toString().padStart(6, '0')}`;
};

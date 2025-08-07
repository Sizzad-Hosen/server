import { OrderModel } from "./order.model";

export const generateInvoiceId = async (): Promise<string> => {
  // Find last order by creation date descending
  const lastOrder = await OrderModel.findOne({}, {}, { sort: { createdAt: -1 } });

  let lastInvoiceNumber = 100000; // default start

  if (lastOrder?.invoiceId) {
    // Extract number after "O-"
    const match = lastOrder.invoiceId.match(/^O-(\d+)$/);
    if (match) {
      lastInvoiceNumber = parseInt(match[1], 10);
    }
  }

  let nextInvoiceNumber = lastInvoiceNumber + 1;

  // Check if nextInvoiceNumber already exists
  let exists = await OrderModel.exists({ invoiceId: `O-${nextInvoiceNumber}` });

  while (exists) {
    nextInvoiceNumber++;
    exists = await OrderModel.exists({ invoiceId: `O-${nextInvoiceNumber}` });
  }

  return `O-${nextInvoiceNumber}`;
};

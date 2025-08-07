import CustomBazarOrder from "./CustomBazerOrder.model";

export const customBazarSearchableField = [
  'invoiceId', // root-level
  'user.name', // populated
  'user.email', // populated
  'address.fullAddress', 
];


export async function customBazarGenerateInvoiceId(): Promise<string> {
  let invoiceId: string;
  let isUnique = false;
  let attempt = 0;

  while (!isUnique && attempt < 10) {
    // Fetch the latest order
    const lastOrder = await CustomBazarOrder.findOne(
      { invoiceId: { $regex: /^CB-\d+$/ } },
      {},
      { sort: { createdAt: -1 } }
    );

    // Start from 99999 if no valid previous invoice
    let lastInvoiceNumber = 99999;

    if (lastOrder?.invoiceId) {
      const match = lastOrder.invoiceId.match(/^CB-(\d+)$/);
      if (match) {
        lastInvoiceNumber = parseInt(match[1], 10);
      }
    }

    const nextInvoiceNumber = lastInvoiceNumber + 1;
    invoiceId = `CB-${nextInvoiceNumber}`;

    // Check if invoiceId already exists
    const exists = await CustomBazarOrder.findOne({ invoiceId });
    if (!exists) {
      isUnique = true;
    } else {
      attempt++;
    }
  }

  if (!isUnique) {
    throw new Error("Failed to generate a unique invoice ID after multiple attempts.");
  }

  return invoiceId;
}

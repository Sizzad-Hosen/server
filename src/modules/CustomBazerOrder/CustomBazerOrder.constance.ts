
export const customBazarSearchableField = [
  'invoiceId', // root-level
  'user.name', // populated
  'user.email', // populated
  'address.fullAddress', 
];



export function customBazarGenerateInvoiceId(): string {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); 
  return `CB-${randomNumber}`;
}

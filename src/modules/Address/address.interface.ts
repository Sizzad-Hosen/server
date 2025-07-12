

export interface TShippingAddress {
  division: string;         // Example: "Dhaka"
  district: string;         // Example: "Rangpur"
  postalCode: string;       // Example: "5400"
  phoneNumber: string;      // Example: "01712345678"
  location: string;         // Area, landmark or road name
  messOrBasaName: string;   // Mess name or rented house name
  paraName?: string;         // Example: "Shahibagh Para"
}

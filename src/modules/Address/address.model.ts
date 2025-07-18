import { model, models, Schema } from "mongoose";
import { TShippingAddress } from "./address.interface";

// Define schema
export const shippingAddressSchema = new Schema<TShippingAddress>({
  division: { type: String, required: true },
  district: { type: String, required: true },
  postalCode: {
    type: String,
    required: true,
    match: [/^\d{4}$/, 'Postal code must be 4 digits']
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number']
  },
  location: { type: String, required: true },
  messOrBasaName: { type: String, required: true },
  paraName: { type: String },
}, { timestamps: true });



export const ShippingAddressModel = models.ShippingAddress ||
  model<TShippingAddress>("ShippingAddress", shippingAddressSchema);

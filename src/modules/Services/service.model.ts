

import mongoose, { Schema, model, models } from 'mongoose';

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = models.Service || model('Service', serviceSchema);

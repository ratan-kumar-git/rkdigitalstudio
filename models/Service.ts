import { Schema, model, models, Document } from "mongoose";

export interface IService extends Document {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;

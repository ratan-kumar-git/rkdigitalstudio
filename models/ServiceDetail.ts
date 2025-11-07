import { Schema, model, models, Document, Types } from "mongoose";

export interface IPackage {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

export interface IServiceDetail extends Document {
  service: Types.ObjectId;
  title: string;
  description: string;
  coverImage?: string;
  packages: IPackage[];
  gallery: string[];
  videoSamples?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    features: { type: [String], required: true },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

const ServiceDetailSchema = new Schema<IServiceDetail>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coverImage: { type: String, default: "" },
    packages: { type: [PackageSchema], default: [] },
    gallery: { type: [String], default: [] },
    videoSamples: { type: [String], default: [] },
  },
  { timestamps: true }
);

const ServiceDetail =
  models.ServiceDetail || model<IServiceDetail>("ServiceDetail", ServiceDetailSchema);

export default ServiceDetail;

import { Schema, model, models, Document, Types } from "mongoose";

export interface IGalleryItem {
  imageUrl: string;
  imageFileId: string;
  thumbnailUrl?: string;
}

export interface ICoverImage {
  imageUrl: string;
  imageFileId: string;
  thumbnailUrl?: string;
}

export interface IPackage {
  _id: string;
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

export interface IServiceDetail extends Document {
  serviceId: Types.ObjectId;
  title: string;
  description: string;
  coverImage?: ICoverImage | null;
  packages: IPackage[];
  gallery: IGalleryItem[];
  videoSamples?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    features: { type: [String], required: true },
    highlight: { type: Boolean, default: false },
  },
  { _id: true }
);

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    imageUrl: { type: String, required: true, trim: true },
    imageFileId: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const CoverImageSchema = new Schema<ICoverImage>(
  {
    imageUrl: { type: String, required: true, trim: true },
    imageFileId: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ServiceDetailSchema = new Schema<IServiceDetail>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coverImage: { type: CoverImageSchema, default: null },
    packages: { type: [PackageSchema], default: [] },
    gallery: { type: [GalleryItemSchema], default: [] },
    videoSamples: { type: [String], default: [] },
  },
  { timestamps: true }
);

const ServiceDetail =
  models.ServiceDetail ||
  model<IServiceDetail>("ServiceDetail", ServiceDetailSchema);

export default ServiceDetail;

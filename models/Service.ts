import { Schema, model, models, Document } from "mongoose";
import ServiceDetail from "./ServiceDetail";

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

// Mongoose middleware for cascade delete
ServiceSchema.pre("findOneAndDelete", async function (next) {
  const service = await this.model.findOne(this.getQuery());
  if (service) {
    await ServiceDetail.deleteMany({ serviceId: service._id });
    console.log(`Deleted service details for serviceId: ${service._id}`);
  }
  next();
});

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;


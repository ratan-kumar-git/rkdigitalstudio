import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  phoneNo: string;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: 5,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

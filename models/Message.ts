import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
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
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Prevent model overwrite upon hot reloads in Next.js
export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

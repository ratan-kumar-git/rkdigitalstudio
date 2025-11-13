import { Schema, model, models, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId;
  serviceDetailId: Types.ObjectId;
  packageId: Types.ObjectId;

  fullName: string;
  email: string;
  phone: string;
  address: string;

  serviceTitle: string;
  packageName: string;
  packagePrice: string;
  packageFeatures: string[];
  bookingDate: Date;

  paymentMode: "upi" | "cash" ;
  amountPaid: number;
  paymentStatus: "pending" | "partial" | "paid" | "refunded" | "failed";

  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceDetailId: { type: Schema.Types.ObjectId, required: true },
    packageId: { type: Schema.Types.ObjectId, required: true },

    fullName: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true },

    serviceTitle: { type: String, required: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    packagePrice: { type: String, required: true, trim: true },
    packageFeatures: { type: [String], default: [] },
    bookingDate: { type: Date, required: true },

    paymentMode: {
      type: String,
      enum: ["upi", "cash" ],
      default: "cash",
      required: true,
    },
    amountPaid: { type: Number, required: true, min: 0, default:0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);
export default Booking;

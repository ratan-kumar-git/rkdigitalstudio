import { Schema, model, models } from "mongoose";

const visitSchema = new Schema(
  {},
  { timestamps: true }
);

export default models.Visit || model("Visit", visitSchema);

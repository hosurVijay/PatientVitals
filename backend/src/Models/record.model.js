import mongoose, { Schema } from "mongoose";

const recordSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true, // important since Cloudinary returns this
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Record = mongoose.model("Record", recordSchema);

import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
    },
    specialty: [
      {
        type: String,
      },
    ],
    experience: {
      type: Number,
    },
    address: {
      type: String,
    },
    ssignedPatients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export { Doctor };

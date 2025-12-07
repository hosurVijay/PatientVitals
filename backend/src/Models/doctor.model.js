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
    assignedPatients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    avatar: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export { Doctor };

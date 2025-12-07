import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    medicalHistory: [
      {
        type: String,
      },
    ],
    currentMedicalStatus: [
      {
        type: String,
      },
    ],
    currentPrescription: [
      {
        medicines: [String],
        prescribedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    historyPrescription: [
      {
        medicines: [String],
        prescribedAt: Date,
      },
    ],
    historyVisit: [
      {
        visitReason: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    historyDocReferred: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export { Patient };

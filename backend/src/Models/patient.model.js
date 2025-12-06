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
        type: String,
      },
    ],
    historyPrescription: [
      {
        type: String,
      },
    ],
    historyVisit: [
      {
        type: String,
      },
    ],
    historyDocReferred: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    adress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export { Patient };

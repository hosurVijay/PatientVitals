import mongoose, { Schema } from "mongoose";

const vitalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
    unique: true,
  },
  BP: {
    systolic: Number,
    diastolic: Number,
  },
  sugarLevel: {
    type: String,
    default: null,
  },
  temperature: {
    type: String,
    default: null,
  },
  weight: {
    type: String,
    default: null,
  },
  spo2: {
    type: String,
    default: null,
  },
});

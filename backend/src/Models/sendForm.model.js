import mongoose, { Schema } from "mongoose";

const sendFormSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isFormSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

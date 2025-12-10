import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
      unique: false,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
      lowercase: false,
      trim: true,
      unique: false,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phonenumber: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["Doctor", "Patient", "Admin", "doctor", "patient", "admin"],
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      unique: false,
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    resetOtp: {
      type: Number,
      default: null,
    },
    otpExpiresIn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      phonenumber: this.phonenumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);

export { User };

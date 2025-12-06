import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
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
      enum: ["Doctor", "Patient", "Admin"],
      required: true,
    },
    password: {
      unique: false,
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export { User };

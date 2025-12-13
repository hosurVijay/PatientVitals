import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadClodinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const res = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filepath);
    return res;
  } catch (error) {
    fs.unlinkSync(filepath);
    return null;
  }
};

export { uploadClodinary };

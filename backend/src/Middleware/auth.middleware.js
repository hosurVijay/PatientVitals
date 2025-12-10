import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/apiError.js";
import { User } from "../Models/user.model.js";

const verifyUser = asyncHandler(async (req, res) => {
  const token =
    req.cookie?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized access.");
  }
  const decodedToken = jwt.verify(token, process.env.Access_Token_Secret);

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(401, "Invalid access Token");
  }

  req.user = user;
  next();
});

export { verifyUser };

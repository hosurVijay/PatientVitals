import { asyncHandler } from "../Utils/asyncHandler";
import { ApiError } from "../Utils/apiError";
import { ApiResponse } from "../Utils/apiResponse";
import { User } from "../Models/user.model";

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "NO user found.");
    }
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access token and Refresh token."
    );
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, phonenumber, password } = req.body;

  if ((!email || !phonenumber) && !password) {
    throw new ApiError(400, "All the fields are required!");
  }

  const user = await User.findOne({
    $or: [{ email }, { phonenumber }],
  });

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  const matchPassword = await user.isPasswordCorrect(password);
  if (!matchPassword) {
    throw new ApiError(400, "Password is incorrect");
  }
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Failed to login. Try again later");
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 100,
  });

  res.status(200).json(new ApiResponse(200, "User logged in", loggedInUser));
});

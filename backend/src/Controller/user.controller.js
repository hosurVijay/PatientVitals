import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/user.model.js";
import { sendMailOtp } from "../Utils/sendOtpMail.js";
import { generateOtp } from "../Utils/generateOtp.js";
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

const registerUser = asyncHandler(async (req, res) => {
  const { email, phonenumber, password, username, fullname, role } = req.body;

  if (
    [email, password, phonenumber, username, fullname].some(
      (field) => field.trim() == ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User already exists ");
  }

  const user = await User.create({
    username,
    email,
    phonenumber,
    role: role?.trim()?.toLowerCase() || "patient",
    password,
    fullname,
  });

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

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
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 100,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User logged in", loggedInUser));
});

const logOut = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user?._id },
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, "user loggedOut successfully", null));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "NO User found");
  }

  const isOldpasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isOldpasswordCorrect) {
    throw new ApiError(401, "Password didn't match");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed sucessfull"));
});

const sendOtp = asyncHandler(async (req, res) => {
  const userEmail = req.user?.email;
  console.log(userEmail);

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  const otp = generateOtp();
  await sendMailOtp(user.email, otp);
  user.resetOtp = otp;
  user.otpExpiresIn = Date.now() + 10 * 60 * 1000;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfull"));
});

const changePasswordWithOTP = asyncHandler(async (req, res) => {
  const { newPassword, otp } = req.body;
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  if (user.otpExpiresIn < Date.now()) {
    throw new ApiError(400, "OTP has expired request a new OTP");
  }

  if (!(user.resetOtp === Number(otp))) {
    throw new ApiError(400, "In valid OTP");
  }

  user.password = newPassword;
  user.resetOtp = null;
  user.otpExpiresIn = null;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const updatePhoneNumber = asyncHandler(async (req, res) => {
  const { phonenumber, otp } = req.body;
  const userId = req.user?._id;

  if (!phonenumber || !otp) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "no user found");
  }

  if (Number(otp) !== user.resetOtp) {
    throw new ApiError(400, "Invalid Otp");
  }

  if (user.otpExpiresIn < Date.now()) {
    throw new ApiError(400, "Otp expired request a new one");
  }

  user.phonenumber = phonenumber;
  user.resetOtp = null;
  user.otpExpiresIn = null;

  await user.save();
  const upadatedUser = await User.findById(userId).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, upadatedUser, "Phone number changed successfully")
    );
});

const updateEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const userId = req.user?._id;

  if (!email || !otp) {
    throw new ApiError(400, "all fields are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "no user found");
  }

  if (Number(otp) !== user.resetOtp) {
    throw new ApiError(400, "Invalid Otp");
  }

  if (user.otpExpiresIn < Date.now()) {
    throw new ApiError(400, "Otp expired request a new one");
  }

  user.email = email;
  user.resetOtp = null;
  user.otpExpiresIn = null;

  await user.save();
  const upadatedUser = await User.findById(userId).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, upadatedUser, "Phone number changed successfully")
    );
});

export {
  registerUser,
  login,
  logOut,
  sendOtp,
  changePasswordWithOTP,
  updateEmail,
  updatePhoneNumber,
  updatePassword,
};

import { Router } from "express";
import {
  registerUser,
  login,
  logOut,
  sendOtp,
  updatePhoneNumber,
  updateEmail,
  updatePassword,
  changePasswordWithOTP,
} from "../Controller/user.controller.js";
import { verifyUser } from "../Middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyUser, logOut);
router.route("/update/email").post(verifyUser, updateEmail);
router.route("/update/phone-number").post(verifyUser, updatePhoneNumber);
router.route("/update/password/otp").post(verifyUser, changePasswordWithOTP);
router.route("/update/password").post(verifyUser, updatePassword);
router.route("/send/otp").post(verifyUser, sendOtp);

export default router;

import { Router } from "express";
import {
  getAllPatients,
  registerPatient,
} from "../Controller/patient.controller.js";
import { verifyUser } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/allPatient").get(getAllPatients);
router.route("/register/patient").post(verifyUser, registerPatient);
export default router;

import { asyncHandler } from "../Utils/asyncHandler.js";
import { Patient } from "../Models/patient.model.js";
import { ApiError } from "../Utils/apiError.js";
import { ApiResponse } from "../Utils/apiResponse.js";
import { User } from "../Models/user.model.js";
import paginate from "express-paginate";
const getAllPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await Patient.find()
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .populate("userId", "-password -refreshToken -resetOtp -otpExpiresIn");
  const totalCount = await Patient.countDocuments();
  const totalPages = Math.ceil(totalCount / limit);

  if (users.length === 0) {
    return res.status(200).json(new ApiResponse(200, null, "No patient found"));
  }

  const data = {
    users,
    totalCount,
    totalPages,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, data, "All patients fetched successfully"));
});

const registerPatient = asyncHandler(async (req, res) => {
  const { age, medicalHistory, historyPrescription, address, avatar } =
    req.body;

  if (!age || !address || address.trim() === "") {
    throw new ApiError(400, "Age and address are required.");
  }

  const existPatient = await Patient.findOne({ userId: req.user._id });

  if (existPatient) {
    throw new ApiError(400, "Patient profile already exist");
  }

  //   Adding Avatar upload logic later

  const patient = await Patient.create({
    userId: req.user._id,
    age,
    medicalHistory: medicalHistory ? medicalHistory : null,
    // avatar: avatar.url,
    address,
    historyDocReferred: [],
    historyVisit: [],
    historyPrescription: historyPrescription || [],
    currentPrescription: [],
    currentMedicalStatus: [],
    avatar: avatar.url,
    isActive: true,
  });

  const fullPatientDetails = await Patient.findOne(patient._id).populate(
    "userId",
    "username fullname email phonenumber role"
  );

  if (!patient) {
    throw new ApiError(
      500,
      "Something went wrong while creating the Patient document."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        fullPatientDetails,
        "Patient profile created successfully"
      )
    );
});

const getActivePatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.skip) || 10;
  const skip = (page - 1) * limit;
  const patients = await Patient.find({ isActive: true })
    .skip(skip)
    .page(page)
    .limit(limit)
    .sort({ _id: -1 })
    .populate("userId", "-password -refreshToken -otpExpirysIn -resetOtp");

  const totalCount = await Patient.countDocuments({ isActive: true });
  const totalPages = totalCount / limit;
  if (patients.length === 0) {
    new ApiResponse(200, "No active Patients found", null);
  }

  const data = {
    patients,
    totalCount,
    totalPages,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200),
      data,
      "All active patient Fetched successfully"
    );
});

const updatePatientAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new ApiError(400, "Image is required");
  }
});

export { getAllPatients, registerPatient, getActivePatients };

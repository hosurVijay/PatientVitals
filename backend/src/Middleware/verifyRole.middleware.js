import { ApiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(404, "No user found.");
  }

  let isAdmin;

  if (userRole === "Admin") {
    isAdmin = true;
  }

  if (!isAdmin) {
    throw new ApiError(403, "Forbidden access.");
  }

  next();
});

const verifyDoctor = asyncHandler(async (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole) {
    throw new ApiError(404, "NO user found");
  }

  let isDOc;

  if (userRole === "Doctor") {
    isDOc = true;
  }

  if (!isDOc) {
    throw new ApiError(403, "Forbidden Access");
  }

  next();
});

const verifyAdminDoc = asyncHandler(async (req, res, next) => {
  const userRole = req.user?.role;

  let isAccessable;
  if (userRole === "Admin" || userRole === "Doctor") {
    isAccessable = true;
  }

  if (!isAccessable) {
    throw new ApiError(403, "Forbidden access");
  }

  next();
});

export { verifyAdmin, verifyDoctor, verifyAdminDoc };

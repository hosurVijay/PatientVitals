import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// User controller Routes
import userRoute from "./Routes/user.routes.js";
app.use("/api/v1/user", userRoute);

import patientRouter from "./Routes/patient.routes.js";
app.use("/api/v1/patient", patientRouter);
export { app };

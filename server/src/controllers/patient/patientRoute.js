import express from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} from "./patientController.js";

const patientRoute = express.Router();

// All routes are protected and require JWT verification
patientRoute.use(verifyJWT);

// Patient routes
patientRoute.post("/", upload.single("profileImage"), createPatient);

patientRoute.get("/", getPatients);
patientRoute.get("/:id", getPatient);
patientRoute.put("/:id", upload.single("profileImage"), updatePatient);
patientRoute.delete("/:id", deletePatient);

export default patientRoute;

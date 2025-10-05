import Patient from "../../models/patient.js";
import {
    asyncHandler,
    uploadOnCloudinary,
    deleteOnCloudinary,
    statusType,
    sendResponse
} from "../../utils/index.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// Generate QR code and upload to Cloudinary
const generateAndUploadQRCode = async (patientData) => {
    try {
        const qrData = {
            patientId: patientData._id.toString(),
            name: patientData.name,
            aadhar: patientData.aadhar,
            phone: patientData.phone,
            age: patientData.age,
            gender: patientData.gender
        };

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF"
            }
        });

        // Convert data URL to buffer
        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Define temp folder path
        const tempDir = "./public/temp";

        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Save QR code to temp folder
        const fileName = `qr-${patientData._id}-${Date.now()}.png`;
        const filePath = path.join(tempDir, fileName);

        fs.writeFileSync(filePath, buffer);

        // Upload to Cloudinary from temp file
        const qrCodeUrl = await uploadOnCloudinary(filePath);

        // Delete the temporary file after upload
        // try {
        //     fs.unlinkSync(filePath);
        // } catch (error) {
        //     console.error("Error deleting temporary QR file:", error);
        // }

        return qrCodeUrl.secure_url;
    } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
};

// Create new patient
export const createPatient = asyncHandler(async (req, res) => {
    const user = req.user;

    // Check if user is ASHA worker
    // if (user.role !== "asha_worker") {
    //     return sendResponse(
    //         res,
    //         false,
    //         null,
    //         "Only ASHA workers can register patients",
    //         statusType.FORBIDDEN
    //     );
    // }

    let patientData = { ...req.body };
    patientData.registeredBy = user._id;
    console.log(patientData,"fefweoi")
    // Convert age to number if it exists
    if (patientData.age) {
        patientData.age = parseInt(patientData.age);
    }

    // Check if patient with same Aadhar already exists
    const existingPatient = await Patient.findOne({ aadhar: patientData.aadhar });
    if (existingPatient) {
        return sendResponse(
            res,
            false,
            null,
            "Patient with this Aadhar number already exists",
            statusType.BAD_REQUEST
        );
    }

    // Handle file upload if present
    // console.log(req.file,"Fewoihfewi")
    if (req.file) {
        const profileImageUrl = await uploadOnCloudinary(req.file.path);
        if (profileImageUrl) {
            patientData.profileImage = profileImageUrl.secure_url;
        }
    }

    // Create patient
    const patient = await Patient.create(patientData);

    // Generate and upload QR code
    const qrCodeUrl = await generateAndUploadQRCode(patient);
    console.log(qrCodeUrl)
    if (qrCodeUrl) {
        patient.qrCode = qrCodeUrl;
        await patient.save();
    }

    const populatedPatient = await Patient.findById(patient._id).populate(
        "registeredBy",
        "name email"
    );

    return sendResponse(
        res,
        true,
        populatedPatient,
        "Patient registered successfully",
        statusType.CREATED
    );
});

// Get all patients for logged-in ASHA worker
export const getPatients = asyncHandler(async (req, res) => {
    const user = req.user;

    const patients = await Patient.find({ registeredBy: user._id })
        .sort({ createdAt: -1 })
        .select("-__v")
        .populate("registeredBy", "name email");

    return sendResponse(res, true, patients, "Patients fetched successfully", statusType.OK);
});

// Get single patient
export const getPatient = asyncHandler(async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const patient = await Patient.findOne({
        _id: id,
        registeredBy: user._id
    }).populate("registeredBy", "name email");

    if (!patient) {
        return sendResponse(res, false, null, "Patient not found", statusType.NOT_FOUND);
    }

    return sendResponse(res, true, patient, "Patient fetched successfully", statusType.OK);
});

// Update patient
export const updatePatient = asyncHandler(async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const patient = await Patient.findOne({
        _id: id,
        registeredBy: user._id
    });

    if (!patient) {
        return sendResponse(res, false, null, "Patient not found", statusType.NOT_FOUND);
    }

    const updateData = { ...req.body };

    // Convert age to number if it exists
    if (updateData.age) {
        updateData.age = parseInt(updateData.age);
    }

    // Handle profile image update
    if (req.file) {
        // Delete old image if exists
        if (patient.profileImage) {
            await deleteOnCloudinary(patient.profileImage);
        }

        const profileImageUrl = await uploadOnCloudinary(req.file);
        if (profileImageUrl) {
            updateData.profileImage = profileImageUrl;
        }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).populate("registeredBy", "name email");

    return sendResponse(res, true, updatedPatient, "Patient updated successfully", statusType.OK);
});

// Delete patient
export const deletePatient = asyncHandler(async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const patient = await Patient.findOne({
        _id: id,
        registeredBy: user._id
    });

    if (!patient) {
        return sendResponse(res, false, null, "Patient not found", statusType.NOT_FOUND);
    }

    // Delete images from Cloudinary
    if (patient.profileImage) {
        await deleteOnCloudinary(patient.profileImage);
    }
    if (patient.qrCode) {
        await deleteOnCloudinary(patient.qrCode);
    }

    await Patient.findByIdAndDelete(id);

    return sendResponse(res, true, null, "Patient deleted successfully", statusType.OK);
});

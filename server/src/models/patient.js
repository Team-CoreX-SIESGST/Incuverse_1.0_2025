import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true
        },
        aadhar: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        issue: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        profileImage: {
            type: String,
            default: null
        },
        marriedStatus: {
            type: String,
            enum: ["single", "married", "divorced", "widowed"],
            required: true
        },
        qrCode: {
            type: String,
            default: null
        },
        registeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        address: {
            type: String,
            trim: true
        },
        emergencyContact: {
            type: String,
            trim: true
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
patientSchema.index({ aadhar: 1 });
patientSchema.index({ registeredBy: 1 });
patientSchema.index({ createdAt: -1 });

export default mongoose.model("Patient", patientSchema);

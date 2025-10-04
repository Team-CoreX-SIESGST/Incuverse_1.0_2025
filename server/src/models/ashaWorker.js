import mongoose from "mongoose";

const ashaWorkerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ashaId: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            },
            formattedAddress: String
        },
        yearsOfExperience: {
            type: Number,
            required: true
        },
        qualifications: [
            {
                type: String
            }
        ],
        languages: [
            {
                type: String,
                default: ["Hindi", "English"]
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        },
        assignedArea: {
            type: String
        },
        governmentId: {
            type: String, // Aadhar number or other government ID
            required: true
        },
        idDocument: {
            type: String // URL to uploaded ID document
        }
    },
    { timestamps: true }
);

// Create geospatial index for location-based queries
ashaWorkerSchema.index({ location: "2dsphere" });

export default mongoose.model("AshaWorker", ashaWorkerSchema);

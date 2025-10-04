import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        isUser: {
            type: Boolean,
            required: true,
            default: true
        },
        // You can store AI model information if using multiple models
        model: {
            type: String,
            default: "default-ai-model"
        }
    },
    { timestamps: true }
);

// Index for better performance
chatSchema.index({ section: 1, createdAt: 1 });
chatSchema.index({ section: 1, isUser: 1 });

export default mongoose.model("Chat", chatSchema);

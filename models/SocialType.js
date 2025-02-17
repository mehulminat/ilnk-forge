import mongoose, { Schema, model } from "mongoose";

const socialTypeSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        name: String,
        itype: {
            type: String,
            enum: ["url", "phone", "email"],
            default: "url"
        },
        status: { type: Number, default: 1 },
    },
    {
        timestamps: true
    }
);

socialTypeSchema.index({ name: 'text' });
let tName =  `${process.env.dbtblPrefix}socialType`;
const socialTypeModal = mongoose.models[tName] || model(tName, socialTypeSchema);
export default socialTypeModal;

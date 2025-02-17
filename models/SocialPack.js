import mongoose, { Schema, model } from "mongoose";

const socialPackSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        name: String,
        status: { type: Number, default: 1 },
        isDefault: { type: Number, default: 0 },
        iconList: Object,
    },
    {
        timestamps: true
    }
);

socialPackSchema.index({ name: 'text' });
let tName =  `${process.env.dbtblPrefix}socialPack`;
const socialPackModal = mongoose.models[tName] || model(tName, socialPackSchema);
export default socialPackModal;

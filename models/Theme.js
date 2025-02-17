import mongoose, { Schema, model } from "mongoose";

const themeSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: String,
        status: { type: Number, default: 1 },
        isDefault: { type: Number, default: 0 },
        metaData: Object,
    },
    {
        timestamps: true
    }
);

themeSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}theme`;
const themeModal = mongoose.models[tName] || model(tName, themeSchema);
export default themeModal;

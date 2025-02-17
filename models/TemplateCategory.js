import mongoose, { Schema, model } from "mongoose";

const templateCategorySchema = new Schema(
    {
        title: String,
        status: { type: Number, default: 1 }
    },
    {
        timestamps: true
    }
);

templateCategorySchema.index({ title: 'text' });
let tName = `${process.env.dbtblPrefix}templateCategory`;
const templateCategoryModal = mongoose.models[tName] || model(tName, templateCategorySchema);
export default templateCategoryModal;

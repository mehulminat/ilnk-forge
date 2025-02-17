import mongoose, { Schema, model } from "mongoose";

let refTemp =  `${process.env.dbtblPrefix}template`;

const templatePageSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refTemp },
        title: String,
        slug: String,
        status: { type: Number, default: 1 },
        isDefault: { type: Number, default: 0 },
        sort: { type: Number, default: 1 },
        templateData: Object,
        seoData: Object,
    },
    {
        timestamps: true
    }
);

templatePageSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}templatePage`;
const templatePageModal = mongoose.models[tName] || model(tName, templatePageSchema);
export default templatePageModal;

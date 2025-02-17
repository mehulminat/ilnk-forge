import mongoose, { Schema, model } from "mongoose";

let refTemp =  `${process.env.dbtblPrefix}template`;
let refTempPage =  `${process.env.dbtblPrefix}templatePage`;

const templateSectionSchema = new Schema(
    {
        templateId: { type: Schema.Types.ObjectId, ref: refTemp },
        pageId: { type: Schema.Types.ObjectId, ref: refTempPage },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: String,
        type: {
            type: String,
            enum: ["el_profile", "el_heading", "el_paragraph", "el_link", "el_image", "el_social_icons", "el_gallery", "el_qrcode","el_video","el_audio"],
            default: "el_heading"
        },
        status: { type: Number, default: 1 },
        isDefault: { type: Number, default: 0 },
        sort: { type: Number, default: 1 },
        sectionData: Object,
        otherBusiness: Array,
        animation: Object,
    },
    {
        timestamps: true
    }
);

templateSectionSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}templateSection`;
const templateSectionModal = mongoose.models[tName] || model(tName, templateSectionSchema);
export default templateSectionModal;

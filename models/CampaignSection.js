import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;
let refCampPage =  `${process.env.dbtblPrefix}campaignPage`;

const campaignSectionSchema = new Schema(
    {
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        pageId: { type: Schema.Types.ObjectId, ref: refCampPage },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: String,
        type: {
            type: String,
            enum: ["el_profile", "el_heading", "el_paragraph", "el_link", "el_image", "el_social_icons", "el_gallery", "el_qrcode","el_video"],
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

campaignSectionSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}campaignSection`;
const campaignSectionModal = mongoose.models[tName] || model(tName, campaignSectionSchema);
export default campaignSectionModal;

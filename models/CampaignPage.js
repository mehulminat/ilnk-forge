import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;

const campaignPageSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
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

campaignPageSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}campaignPage`;
const campaignPageModal = mongoose.models[tName] || model(tName, campaignPageSchema);
export default campaignPageModal;

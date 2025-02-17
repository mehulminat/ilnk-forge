import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;
let refCampPage =  `${process.env.dbtblPrefix}campaignPage`;

const campaignLinkSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        pageId: { type: Schema.Types.ObjectId, ref: refCampPage },
        url: String,
        visitCount: { type: Number }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignLink`;
const campaignLinkModal = mongoose.models[tName] || model(tName, campaignLinkSchema);
export default campaignLinkModal;

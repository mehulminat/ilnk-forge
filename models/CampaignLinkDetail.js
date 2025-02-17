import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;
let refCampLink =  `${process.env.dbtblPrefix}campaignLink`;
let refCampPage =  `${process.env.dbtblPrefix}campaignPage`;

const campaignLinkDetailSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        pageId: { type: Schema.Types.ObjectId, ref: refCampPage },
        linkId: { type: Schema.Types.ObjectId, ref: refCampLink },
        visitCount: { type: Number }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignLinkDetail`;

const campaignLinkDetailModal = mongoose.models[tName] || model(tName, campaignLinkDetailSchema);
export default campaignLinkDetailModal;

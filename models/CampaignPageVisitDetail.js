import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;
let refCampPage =  `${process.env.dbtblPrefix}campaignPage`;

const campaignPageVisitDetailSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        pageId: { type: Schema.Types.ObjectId, ref: refCampPage },
        visitCount: { type: Number },
        ipAddress: { type: String }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignPageVisitDetail`;
const campaignPageVisitDetailModal = mongoose.models[tName] || model(tName, campaignPageVisitDetailSchema);
export default campaignPageVisitDetailModal;

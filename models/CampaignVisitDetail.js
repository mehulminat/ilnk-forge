import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;

const campaignVisitDetailSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        visitCount: { type: Number },
        ipAddress: { type: String }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignVisitDetail`;
const campaignVisitDetailModal = mongoose.models[tName] || model(tName, campaignVisitDetailSchema);
export default campaignVisitDetailModal;

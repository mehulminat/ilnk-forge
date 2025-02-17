import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;

const campaignVisitSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        visitCount: { type: Number }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignVisit`;
const campaignVisitModal = mongoose.models[tName] || model(tName, campaignVisitSchema);
export default campaignVisitModal;

import mongoose, { Schema, model } from "mongoose";

let refCamp =  `${process.env.dbtblPrefix}campaign`;
let refCampPage =  `${process.env.dbtblPrefix}campaignPage`;

const campaignPageVisitSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateId: { type: Schema.Types.ObjectId, ref: refCamp },
        pageId: { type: Schema.Types.ObjectId, ref: refCampPage },
        visitCount: { type: Number }
    },
    {
        timestamps: true
    }
);

let tName = `${process.env.dbtblPrefix}campaignPageVisit`;
const campaignPageVisitModal = mongoose.models[tName] || model(tName, campaignPageVisitSchema);
export default campaignPageVisitModal;

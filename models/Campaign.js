import mongoose, { Schema, model } from "mongoose";

let refTem = `${process.env.dbtblPrefix}template`;
let refTCat = `${process.env.dbtblPrefix}templateCategory`;
let refTheme = `${process.env.dbtblPrefix}theme`;
let refPack = `${process.env.dbtblPrefix}socialPack`;

const campaignSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: String,
        slug: String,
        catId: { type: Schema.Types.ObjectId, ref: refTCat },
		themeId: { type: Schema.Types.ObjectId, ref: refTheme },
		packId: { type: Schema.Types.ObjectId, ref: refPack },
        profile: Object,
        usedTemplateId: { type: Schema.Types.ObjectId, ref: refTem },
        status: { type: Number, default: 1 },
        templateData: String,
        templateStyle: Object,
		SocialIconData: Object,
        isCustomTheme: { type: Number, default: 0 },
        html_theme_id: String,
        thumb: Object,
        otherBusiness: Array
    },
    {
        timestamps: true
    }
);

campaignSchema.index({ title: 'text' });
let tName =  `${process.env.dbtblPrefix}campaign`;
const campaignModal = mongoose.models[tName] || model(tName, campaignSchema);
export default campaignModal;

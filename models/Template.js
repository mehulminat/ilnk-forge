import mongoose, { Schema, model } from "mongoose";

let refTCat = `${process.env.dbtblPrefix}templateCategory`;
let refTheme = `${process.env.dbtblPrefix}theme`;
let refPack = `${process.env.dbtblPrefix}socialPack`;

const templateSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		title: String,
		slug: String,
		catId: { type: Schema.Types.ObjectId, ref: refTCat },
		themeId: { type: Schema.Types.ObjectId, ref: refTheme },
		packId: { type: Schema.Types.ObjectId, ref: refPack },
		profile: Object,
		status: { type: Number, default: 1 },
		templateData: Object,
		templateStyle: Object,
		SocialIconData: Object,
		isCustomTheme: { type: Number, default: 0 },
		html_theme_id: String,
		thumb: Object
	},
	{
		timestamps: true,
	}
);

templateSchema.index({ title: "text" });
let tName = `${process.env.dbtblPrefix}template`;
const templateModal = mongoose.models[tName] || model(tName, templateSchema);
export default templateModal;

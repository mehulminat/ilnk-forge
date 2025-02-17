import mongoose, { Schema, model } from "mongoose";

const settingSchema = new Schema(
	{
		parentId: { type: Schema.Types.ObjectId, ref: "User" },
		stripeKey: String,
		stripeSecret: String,
		paypalKey : String,
		paypalSecret: String,
		paypalTestMode:Boolean,
		razorpayKey : String,
		razorpaySecret : String,
		isEnabled: Boolean,
		isAdEnabled: Boolean,
		adScript: String,
		adScriptCode: String,
		source: String,
		currency: Object,
		emailSettings : Object,
		isEnableBankTransfer: Boolean,
		bankTransferIns : String,
		status: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

let tName =  `${process.env.dbtblPrefix}AdminSetting`;
const settingModel = mongoose.models[tName] || model(tName, settingSchema);
export default settingModel;

import mongoose, { Schema, model } from "mongoose";

const couponSchema = new Schema(
	{
		parentId: { type: Schema.Types.ObjectId, ref: "User" },
		couponName: String,
		couponCode: String,
		discountType: String,
		discount: Number,
		duration: String,
		minAmount :Number,
		status: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

let tName =  `${process.env.dbtblPrefix}Coupon`;
const couponModel = mongoose.models[tName] || model(tName, couponSchema);
export default couponModel;

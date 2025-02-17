import mongoose, { Schema, model } from "mongoose";

const planSchema = new Schema(
	{
		parentId: { type: Schema.Types.ObjectId, ref: "User" },
		planname: String,
		price: Number,
		validity: Number,
		source: String,
		currency: Object,
		status: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

let tName =  `${process.env.dbtblPrefix}Plan`;
const planModel = mongoose.models[tName] || model(tName, planSchema);
export default planModel;

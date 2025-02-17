import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		parentId: { type: Schema.Types.ObjectId, ref: "User" },
		name: String,
		email: String,
		password: String,
		contactNumber: String,
		role: { type: Number, default: 2 },
		profilePicture: {},
		ip: String,
		source: String,
		accessLevel: [], // 0 - FE, 1 - OTO1, 2 - OTO2, 3 - OTO3, 4 - OTO4, 5 - OTO5 
		resetPasswordToken: String,
		settings: {},
		validityDate: Date,
		planName: String,
		status: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

userSchema.index({ name: "text", email: "text" });
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;

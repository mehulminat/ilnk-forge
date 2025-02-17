import mongoose, { Schema, model } from "mongoose";

const BillingSchema = new Schema(
    {
        customer_id: { type: Schema.Types.ObjectId, ref: "User" },
		planId: String,
        invoice_id: String,
        shiping_details: Object,
        validity: Number,
        amount: Number,
        title: String,
		unitPrice: Number,
        paymentStatus:String,
        invoice_url:String,
        paymentMethod:String,
        currency: String,
        couponCode: String,
        payloadData: String,
        status : String
	},
	{
		timestamps: true,
	}
);

let tName =  `${process.env.dbtblPrefix}Billing`;
const BillingModel = mongoose.models[tName] || model(tName, BillingSchema);
export default BillingModel;

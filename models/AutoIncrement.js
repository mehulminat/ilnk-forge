import mongoose, { Schema, model } from "mongoose";

const auto = new Schema(
    {
    _id: { type:String }, 
    sequence_value: { type:Number},
    },
    {
    timestamps: true
    }
);
    
let tName =  `${process.env.dbtblPrefix}AutoIncrement`;
const AutoIncrement = mongoose.models[tName] || model(tName, auto);
export default AutoIncrement;

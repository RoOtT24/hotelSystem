import mongoose, { Schema, Types, model } from "mongoose";
const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // unique:true,
    },
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    cityId: {
      type: Types.ObjectId,
      ref: "City",
      required: true,
    },
    countryId: {
        type: Types.ObjectId,
        ref: "Country",
        required: true,
    },
    lat: {
      type: Types.Decimal128,
      required: true,
    },
    lng: {
      type: Types.Decimal128,
      required: true,
    },
    type: {
      type: string,
      required: true,
      enum: ["Suite", "Luxury", "Deluxe", "Premium"],
    },
    hasWifi:{
        type:Boolean,
        default:false,
    },
    hasAc:{
        type:Boolean,
        default:false,
    },
    hasBreakFast:{
        type:Boolean,
        default:false,
    },
    numberOfTwinBeds:{
        type:number,
        required:true,
    },
    numberOfQueenBeds:{
        type:number,
        required:true,
    },
    numberOfFullBeds:{
        type:number,
        required:true,
    },
    numberOfKingBeds:{
        type:number,
        required:true,
    },
    nightPrice:{
        type:number,
        required:true,
    },
    discountPerDay:{
        type:number,
        default:0,
    },
    discount:{
        type:number,
        default:0,
    },
    finalPrice:{
        type:number,
        required:true,
    },
  },
  {
    timestamps: true,
  }
);
const roomModel = mongoose.models.Room || model("Room", roomSchema);
export default roomModel;

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
    regionId: {
        type: Types.ObjectId,
        ref: "Region",
        required: true,
    },
    hotelId: {
        type: Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    type: {
      type: String,
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
        type:Number,
        required:true,
    },
    numberOfQueenBeds:{
        type:Number,
        required:true,
    },
    numberOfFullBeds:{
        type:Number,
        required:true,
    },
    numberOfKingBeds:{
        type:Number,
        required:true,
    },
    nightPrice:{
        type:Number,
        required:true,
    },
    discountPerDay:{
        type:Number,
        default:0,
    }
  },
  {
    timestamps: true,
  }
);
const roomModel = mongoose.models.Room || model("Room", roomSchema);
export default roomModel;

import mongoose, { Schema, Types, model } from "mongoose";
const HotelSchema = new Schema(
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
    lat: {
      type: Types.Decimal128,
      required: true,
    },
    lng: {
      type: Types.Decimal128,
      required: true,
    },
    zipCode: {
      type: number,
      required: true,
    },
    subImages: { type: [{ type: Object, required: true }], required: true },
    hasSeaView: { type: Boolean, required: true },
    facilities: { type: [{ type: String, required: true }], required: true },
    mainImage: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const HotelModel = mongoose.models.Hotel || model("Hotel", HotelSchema);
export default HotelModel;
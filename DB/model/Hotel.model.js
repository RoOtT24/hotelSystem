import mongoose, { Schema, Types, model } from "mongoose";
const HotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // unique:true,
    },
    description: {
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
    subImages: { type: [{ type: Object, required: true }], required: true },
    hasSeaView: { type: Boolean, required: true },
    facilities: { type: [{ type: String, required: true }], required: true },
    mainImage: {
      type: Object,
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

HotelSchema.virtual('reviews', {
  localField:'_id',
  foreignField:'hotelId',
  ref:"Review"
});
const HotelModel = mongoose.models.Hotel || model("Hotel", HotelSchema);
export default HotelModel;

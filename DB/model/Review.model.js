import mongoose, { Schema, Types, model } from "mongoose";
const reviewSchema = new Schema(
  {
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
    },
    hotelId:{
        type:Types.ObjectId,
        ref:'Hotel',
        required:true,
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
    staff:{
        type:Types.Decimal128,
        required: true,
    },
    facilities:{
        type:Types.Decimal128,
        required:true,
    },
    cleanliness:{
        type:Types.Decimal128,
        required: true,
    },
    comfort:{
        type:Types.Decimal128,
        required: true,
    },
    valueForMoney:{
        type:Types.Decimal128,
        required: true,
    },
    location:{
        type:Types.Decimal128,
        required: true,
    },
    rating:{
        type:Types.Decimal128,
        required: true,
    },
    images:[{type:Object, required:true}],
    goodReview:{
        type:String,
        required:true,
    },
    badReview:{
        type:String,
        required:true,
    },
},
  {
    timestamps: true,
  }
);
const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel;

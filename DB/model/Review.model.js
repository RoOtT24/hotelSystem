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
        type:number,
        required: true,
    },
    facilities:{
        type:number,
        required:true,
    },
    cleanliness:{
        type:number,
        required: true,
    },
    comfort:{
        type:number,
        required: true,
    },
    valueForMoney:{
        type:number,
        required: true,
    },
    location:{
        type:number,
        required: true,
    },
    rating:{
        type:number,
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

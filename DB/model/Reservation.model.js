import mongoose, { Schema, Types, model } from "mongoose";
const reservationSchema = new Schema(
  {
    rooms: {
      type: [
        {
          roomId: { type: Types.ObjectId, ref: "Room", required: true },
          // price: { type: Number, required: true },
          // discountPerDay: { type: Number, required: true },
          // finalPrice: { type: Number, required: true },
        },
      ],
      required: true,
    },
    discount: {
      // amount (not percentage)
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    couponId:{
        type: Types.ObjectId,
        ref:'Coupon',
    },
    from:{
      type:Date,
      required: true,
    },
    to:{
      type:Date,
      required: true,
    },
    paymentType:{
      type:String,
      enum:['Cash','Visa'],
      default: 'Cash',
    },
    status:{
      type:String,
      enum:['pending', 'approved', 'complete', 'cancelled'],
      default:'pending'
    },
    cancelReason:{
      type:String,
    },
    updatedBy:{
      type:Types.ObjectId,
      ref:'User'
    },
  },
  {
    timestamps: true,
  }
);
const reservationModel =
  mongoose.models.Reservation || model("Reservation", reservationSchema);
export default reservationModel;

import mongoose, { Schema, Types, model } from "mongoose";
const reservationSchema = new Schema(
  {
    rooms: {
      type: [
        {
          roomId: { type: Types.ObjectId, ref: "Room", required: true },
          price: { type: number, required: true },
          discountPerDay: { type: number, required: true },
          finalPrice: { type: number, required: true },
        },
      ],
      required: true,
    },
    discount: {
      // amount (not percentage)
      type: number,
      default: 0,
    },
    finalPrice: {
      type: number,
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
  },
  {
    timestamps: true,
  }
);
const reservationModel =
  mongoose.models.Reservation || model("Reservation", reservationSchema);
export default reservationModel;

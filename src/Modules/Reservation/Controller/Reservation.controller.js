import reservationModel from "../../../../DB/model/Reservation.model.js";
import hotelModel from "../../../../DB/model/Hotel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
import roomModel from "../../../../DB/model/Room.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";

export const createReservation = async (req, res, next) => {
  const { from, to, couponId, rooms , paymentType} = req.body;
  const { roomId } = req.params;

  const room = await roomModel.findById(roomId);
  if (!room) {
    return next(new Error("no room found", { cause: 404 }));
  }
  if (couponId) {
    const coupon = await couponModel.findById(couponId);
    if (!coupon) return next(new Error("no coupon found", { cause: 404 }));
    const now = moment();
    const parsed = moment(coupon.expireDate, "DD/MM/YYYY");
    const diff = now.diff(parsed, "days");
    if (diff >= 0) 
      return next(new Error("coupon expired", { cause: 400 }));
    if (coupon.usedBy.indexOf(req.user._id) != -1) {
      return next(
        new Error(`coupon already used by ${req.user._id}`, { cause: 400 })
      );
    }
    req.body.discount = coupon.amount;
  }

  const now = moment();
  const parsedFrom = moment(from, "DD/MM/YYYY");
  const parsedTo = moment(to, "DD/MM/YYYY");
  const diff = parsedTo.diff(parsedFrom,"days");
  if(from.diff(parsedFrom,"days")>0 || now.diff(parsedTo,"days")>0)
    return next(new Error('invalid dates', {cause:400}))
  req.body.finalPrice =0;
  for (room in rooms) {
    const checkRoom = await roomModel.findById(room.roomId);
    if(!checkRoom){
      return next(new Error(`invalid room ${room.roomId}`, {cause:400}));
    }
    const reservationCheck = await reservationModel.findOne({status:{$not:'cancelled'},roomId, $or:[{$and:[{from:{$lte:from}}, {to:{$gt:from}}]}, {$and:[{from:{$gte:from}}, {from:{lte:to}}]}]});
    if(reservationCheck)
      return next(new Error(`the room is already reserved at this date`,{cause:400}));
    const discount = diff > 7 ? 3.5 * checkRoom.discountPerDay: diff/2*checkRoom.discountPerDay;
    const finalPrice = discount*checkRoom.price;
    req.body.finalPrice += finalPrice;
  }
  if(paymentType && paymentType == 'Visa')
      req.body.status = 'approved';

  req.body.userId = req.user._id;
  const reservation = await reservationModel.create({ ...req.body });
  return res.status(201).json({ message: "success", reservation });
};

export const updateReservation = async (req, res, next) => {
  const { discount } = req.body;
  const { reservationId } = req.params;

  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    return next(new Error("no reservation found", { cause: 404 }));
  }
  reservation.discount = discount;
  reservation.updatedBy = req.user._id;
  reservation.save();
  return res.status(200).json({ message: "success", reservation: result });
};

export const cancelReservation = async (req, res, next) => {
  const { reservationId } = req.params;
  const {cancelReason} = req.body;
  const reservation = await reservationModel.findOne({
    _id: reservationId
  });
  if(reservation && req.user.role != 'admin' && req.user._id != reservation._id)
    return next(new Error('can not check reservation of other user',{cause:400}));
  if (!reservation) {
    return next(new Error("no reservation found", { cause: 404 }));
  }
  reservation.status='cancelled';
  reservation.updatedBy=req.user._id;
  reservation.cancelReason = cancelReason;
  reservation.save();
  return res.status(200).json({ message: "success", reservation });
};

export const getReservation = async (req, res, next) => {
  const { reservationId } = req.params;
  const reservation = await reservationModel.findOne({
    _id: reservationId,
  });
  if(reservation && req.user.role != 'admin' && req.user._id != reservation._id)
    return next(new Error('can not check reservation of other user',{cause:400}));
  if (!reservation) {
    return next(new Error("no reservation found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", reservation });
};


export const getReservations = async (req, res, next) => {
  const reservations = await reservationModel.find();
  if (!reservations) {
    return next(new Error("no reservations found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", reservations });
};

export const getReservationsInHotel = async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = hotelModel.findOne({
    _id: hotelId,
  });
  if (!hotel) {
    return next(new Error("no hotel found", { cause: 404 }));
  }
  const reservations = await reservationModel.find({ hotelId });
  if (!reservations) {
    return next(new Error("no reservations found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", reservations });
};

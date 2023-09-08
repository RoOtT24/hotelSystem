import reservationModel from "../../../../DB/model/Reservation.model.js";
import hotelModel from "../../../../DB/model/Hotel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
import roomModel from "../../../../DB/model/Room.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import moment from "moment";
import { roles } from "../../../Middleware/auth.middleware.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { createInvoice } from "../../../Services/pdf.js";

export const createReservation = async (req, res, next) => {
  let { from, to, couponId, rooms, paymentType } = req.body;

  if (couponId) {
    const coupon = await couponModel.findById(couponId);
    if (!coupon) return next(new Error("no coupon found", { cause: 404 }));
    if(coupon.usedBy.contains(req.user.id)) return next(new Error("coupon already used by this user", { cause: 400 }));
    const now = moment();
    const parsed = moment(coupon.expireDate, "DD/MM/YYYY");
    const diff = now.diff(parsed, "days");
    if (diff >= 0) return next(new Error("coupon expired", { cause: 400 }));
    if (coupon.usedBy.indexOf(req.user._id) != -1) {
      return next(
        new Error(`coupon already used by ${req.user._id}`, { cause: 400 })
      );
    }
    req.body.discount = coupon.amount;
  }

  req.body.finalPrice = 0;
  req.body.subTotal = 0;
  const now = moment();
  const parsedFrom = moment(from, "MM/DD/YYYY");
  const parsedTo = moment(to, "MM/DD/YYYY");
  const diff = parsedTo.diff(parsedFrom, "days");
  if (diff < 0 || now.diff(parsedTo, "days") > 0)
    return next(new Error("invalid dates", { cause: 400 }));

    req.body.roomsInvoke = [];
  for (let i = 0; i < rooms.length; ++i) {
    const checkRoom = await roomModel.findById(rooms[i].roomId);
    if (!checkRoom) {
      return next(new Error(`invalid room ${rooms[i].roomId}`, { cause: 400 }));
    }
    // return res.json(parsedFrom.toDate())
    const reservationCheck = await reservationModel.findOne({
      status: { $not: { $eq: "cancelled" } },
      roomId: rooms[i].roomId,
      $or: [
        {
          $and: [
            { from: { $lte: parsedFrom.toDate() } },
            { to: { $gt: parsedFrom.toDate() } },
          ],
        },
        {
          $and: [
            { from: { $gte: parsedFrom.toDate() } },
            { from: { $lte: parsedTo.toDate() } },
          ],
        },
      ],
    });
    if (reservationCheck)
      return next(
        new Error(`the room is already reserved at this date`, { cause: 400 })
      );
    const discount =
      (diff > 7
        ? 3.5 * checkRoom.discountPerDay
        : (diff / 2) * checkRoom.discountPerDay) / 100;
        checkRoom.finalPrice = checkRoom.nightPrice * diff;
        req.body.subTotal += checkRoom.finalPrice;
        const finalPrice = (checkRoom.nightPrice - discount * checkRoom.nightPrice)*diff;
    req.body.finalPrice += finalPrice;
    req.body.discount = discount * 100;
    req.body.roomsInvoke.push(checkRoom);
  }
  if (paymentType && paymentType == "Visa") req.body.status = "approved";
  // return res.json(req.body.finalPrice)
  req.body.userId = req.user._id;
  // return res.json("here");
  req.body.from = parsedFrom.toDate();
  req.body.to = parsedTo.toDate();
  const reservation = await reservationModel.create({ ...req.body });

  const invoice = {
    shipping: {
      name: req.user.userName,
      address:``,
      city: "",
      state: "",
      country: "",
      postal_code: "",
      discount:req.body.discount,
      days:diff,
    },
    items: req.body.roomsInvoke,
    subtotal:req.body.subTotal,
    total: reservation.finalPrice,
    invoice_nr: reservation._id
  };

  createInvoice(invoice, "invoice.pdf");

  await sendEmail(req.user.email, 'invoice Hotel System', 'congrats, your reservation has been created', {path:'invoice.pdf', contentType:'application/pdf' });

  return res.status(201).json({ message: "success", reservation });
};

export const updateReservation = async (req, res, next) => {
  const { discount, status } = req.body;
  const { reservationId } = req.params;

  if(!status && !discount) {
    return next(new Error('nothing to update',{cause:400}));
  }
  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    return next(new Error("no reservation found", { cause: 404 }));
  }
  // const room = await roomModel.findById(
  if (discount) {
    if (reservation.status != "pending")
      return next(
        new Error("can not change discount because the status is not pending", {
          cause: 400,
        })
      );
    reservation.discount = discount;
    reservation.finalPrice =
      checkRoom.nightPrice - (discount / 100) * checkRoom.nightPrice;
  }
  if (status) reservation.status = status;
  reservation.updatedBy = req.user._id;
  reservation.save();

  const user = await userModel.findById(reservation.userId)
  await sendEmail(req.user.email, 'Hotel System Reservation', `<h2>Your reservation has been updated</h2><br/><p>discount : ${reservation.discount}</p><br/><p>status : ${reservation.status}</p>`);


  return res.status(200).json({ message: "success", reservation });
};

export const cancelReservation = async (req, res, next) => {
  const { reservationId } = req.params;
  const { cancelReason } = req.body;
  const reservation = await reservationModel.findOne({
    _id: reservationId,
  });
  if (
    reservation &&
    req.user.role != roles.Admin &&
    req.user.role != roles.SuperAdmin &&
    req.user._id != reservation._id
  )
    return next(
      new Error("can not cancel reservation of other user", { cause: 400 })
    );
  if (!reservation) {
    return next(new Error("no reservation found", { cause: 404 }));
    reservation;
  }
  reservation.status = "cancelled";
  reservation.updatedBy = req.user._id;
  reservation.cancelReason = cancelReason;
  reservation.save();

  await sendEmail(req.user.email, 'invoice Hotel System', `<h2>Your reservation has been cancelled!</h2><br/><p>cancel reason :${cancelReason}</p><br/><p>cancelled by :${req.user.userName}</p>`);

  return res.status(200).json({ message: "success", reservation });
};

export const getReservation = async (req, res, next) => {
  const { reservationId } = req.params;
  const reservation = await reservationModel.findOne({
    _id: reservationId,
  });

  if (
    reservation &&
    req.user.role != roles.Admin &&
    req.user.role != roles.SuperAdmin &&
    req.user._id != reservation._id
  )
    return next(
      new Error("can not check reservation of other user", { cause: 400 })
    );
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

  const rooms = roomModel.find({
    hotelId,
  });
  if (!rooms) {
    return next(new Error("no rooms found in this hotel", { cause: 404 }));
  }
  const roomIds = rooms.map(room =>room._id);
  const reservations = await reservationModel.find({ 'rooms.roomId':{$in:roomIds} });
  if (!reservations) {
    return next(new Error("no reservations found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", reservations });
};

export const getAvailableInHotel = async (req, res, next) => {
  const { hotelId } = req.params;
  const {from, to} = req.body;

  const now = moment();
  const parsedFrom = moment(from, "MM/DD/YYYY");
  const parsedTo = moment(to, "MM/DD/YYYY");
  const diff = parsedTo.diff(parsedFrom, "days");
  if (diff < 0 || now.diff(parsedTo, "days") > 0)
    return next(new Error("invalid dates", { cause: 400 }));


  const rooms = roomModel.find({
    hotelId,
  });
  if (!rooms) {
    return next(new Error("no rooms found in this hotel", { cause: 404 }));
  }
  // const roomIds = rooms.map(room =>room._id);
  const reservations = await reservationModel.find({ 'rooms.roomId':{$in:roomIds}, status: {$not:'cancelled'}, f$or: [
    {
      $and: [
        { from: { $lte: parsedFrom.toDate() } },
        { to: { $gt: parsedFrom.toDate() } },
      ],
    },
    {
      $and: [
        { from: { $gte: parsedFrom.toDate() } },
        { from: { $lte: parsedTo.toDate() } },
      ],
    },
  ],});
  if (!reservations) {
    return next(new Error("no reservations found", { cause: 404 }));
  }
  const roomIds = reservations.map(reservation=>reservation.rooms.roomId);
  const result = (await rooms).filter(room => !roomIds.includes(room._id));
  
  return res.status(200).json({ message: "success", rooms:result });
};
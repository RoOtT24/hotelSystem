import reservationModel from "../../../../DB/model/Reservation.model.js";
import hotelModel from "../../../../DB/model/Hotel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
import roomModel from "../../../../DB/model/Room.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import moment from "moment";
import { roles } from "../../../Middleware/auth.middleware.js";

export const createReservation = async (req, res, next) => {
  let { from, to, couponId, rooms, paymentType } = req.body;

  if (couponId) {
    const coupon = await couponModel.findById(couponId);
    if (!coupon) return next(new Error("no coupon found", { cause: 404 }));
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

  const now = moment();
  const parsedFrom = moment(from, "MM/DD/YYYY");
  const parsedTo = moment(to, "MM/DD/YYYY");
  const diff = parsedTo.diff(parsedFrom, "days");
  // return res.json(diff)
  req.body.finalPrice = 0;
  if (diff < 0 || now.diff(parsedTo, "days") > 0)
    return next(new Error("invalid dates", { cause: 400 }));
  // req.body.roomNames = "";
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
    const finalPrice = checkRoom.nightPrice - discount * checkRoom.nightPrice;
    req.body.finalPrice += finalPrice;
    req.body.discount = discount * 100;
  }
  if (paymentType && paymentType == "Visa") req.body.status = "approved";
  // return res.json(req.body.finalPrice)
  req.body.userId = req.user._id;
  // return res.json("here");
  req.body.from = parsedFrom.toDate();
  req.body.to = parsedTo.toDate();
  const reservation = await reservationModel.create({ ...req.body });

  // const invoice = {
  //   shipping: {
  //     name: req.user.userName,
  //     address:`${req.body.roomNames}`,
  //     // city: "San Francisco",
  //     // state: "CA",
  //     country: "will make it in next version",
  //     // postal_code: 94111
  //   },
  //   items: order.products,
  //   subtotal:order.subTotal,
  //   total: order.finalPrice,
  //   invoice_nr: order._id
  // };

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

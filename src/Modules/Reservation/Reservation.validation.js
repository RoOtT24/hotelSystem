import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createReservation = joi.object({
   from:joi.required(),
   to:joi.required(),
   rooms:joi.array().items(joi.object({roomId:generalFields.id.required()})).required(),
   couponId:generalFields.id,
   paymentType:joi.string().allow('Cash', 'Visa'),
}).required();

export const updateReservation = joi.object({
   discount:joi.number().required(),
   reservationId:generalFields.id.required(),
}).required();

export const cancelReservation = joi.object({
   reservationId: generalFields.id.required(),
   cancelReason: joi.string().required(),

}).required();

export const getReservation = joi.object({
   reservationId: generalFields.id.required(),
}).required()

export const getReservations = joi.object({
}).required()


export const getReservationsInHotel = joi.object({
   hotelId: generalFields.id.required(),
}).required()


// 
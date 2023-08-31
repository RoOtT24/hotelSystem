import { Router } from "express";
import * as reservationController from './Controller/Reservation.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Reservation.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Reservation.EndPoint.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";

const router = Router({mergeParams:true});
router.post('/', auth(endPoint.create), validation(validators.createReservation),asyncHandler(reservationController.createReservation));
router.put('/:reservationId', auth(endPoint.update), validation(validators.updateReservation),asyncHandler(reservationController.updateReservation));
router.get('/one/:reservationId', auth(), validation(validators.getReservation),asyncHandler(reservationController.getReservation));
router.get('/', auth(endPoint.get), validation(validators.getReservations),asyncHandler(reservationController.getReservations));
router.patch('/cancelReservation', auth(), validation(validators.cancelReservation),asyncHandler(reservationController.cancelReservation));
router.get('/inHotel/', auth(endPoint.get), validation(validators.getReservationsInHotel),asyncHandler(reservationController.getReservationsInHotel));
export default router;
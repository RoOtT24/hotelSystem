import { Router } from "express";
import * as hotelController from './Controller/Hotel.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Hotel.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Hotel.EndPoint.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
asyncHandler
const router = Router({mergeParams:true});
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([{name:'mainImage', maxCount:1}, {name:'subImages', maxCount:30}]), validation(validators.createHotel),asyncHandler(hotelController.createHotel));
router.put('/:hotelId', auth(endPoint.update), validation(validators.updateHotel),asyncHandler(hotelController.updateHotel));
router.delete('/:hotelId', auth(endPoint.delete), validation(validators.deleteHotel),asyncHandler(hotelController.deleteHotel));
router.get('/one/:hotelId', auth(endPoint.get), validation(validators.getHotel),asyncHandler(hotelController.getHotel));
router.get('/', auth(endPoint.get), validation(validators.getHotels),asyncHandler(hotelController.getHotels));
router.get('/inCity/:countryId', auth(endPoint.get), validation(validators.getHotelsInCity),asyncHandler(hotelController.getHotelsInCity));
router.get('/inRegion/:countryId', auth(endPoint.get), validation(validators.getHotelsInRegion),asyncHandler(hotelController.getHotelsInRegion));
export default router;
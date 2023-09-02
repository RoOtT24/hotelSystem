import { Router } from "express";
import * as roomController from './Controller/Room.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Room.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Room.EndPoint.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
const router = Router({mergeParams:true});

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([{name:'mainImage', maxCount:1}, {name:'subImages', maxCount:30}]), validation(validators.createRoom),asyncHandler(roomController.createRoom));
router.put('/:roomId', auth(endPoint.update), fileUpload(fileValidation.image).fields([{name:'mainImage', maxCount:1}, {name:'subImages', maxCount:30}]), validation(validators.updateRoom),asyncHandler(roomController.updateRoom));
router.delete('/:roomId', auth(endPoint.delete), validation(validators.deleteRoom),asyncHandler(roomController.deleteRoom));
router.get('/one/:roomId', validation(validators.getRoom),asyncHandler(roomController.getRoom));
router.get('/', validation(validators.getRooms),asyncHandler(roomController.getRooms));
router.get('/inHotel/', validation(validators.getRoomsInHotel),asyncHandler(roomController.getRoomsInHotel));

export default router;
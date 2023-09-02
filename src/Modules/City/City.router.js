import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multer.js";
import * as cityController from './Controller/City.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './City.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./City.EndPoint.js";
import regionRouter from '../Region/Region.router.js';

const router = Router({mergeParams:true});

router.use('/:cityId/region', regionRouter);
router.post('/', auth(endPoint.create), validation(validators.createCity),asyncHandler(cityController.createCity));
router.put('/:cityId', auth(endPoint.update), validation(validators.updateCity),asyncHandler(cityController.updateCity));
router.delete('/:cityId', auth(endPoint.delete), validation(validators.deleteCity),asyncHandler(cityController.deleteCity));
router.get('/one/:cityId', validation(validators.getCity),asyncHandler(cityController.getCity));
router.get('/', validation(validators.getCities),asyncHandler(cityController.getCities));
router.get('/inCountry/', validation(validators.getCitiesInCountry),asyncHandler(cityController.getCitiesInCountry));

export default router;
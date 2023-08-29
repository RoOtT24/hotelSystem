import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multer.js";
import * as countryController from './Controller/Country.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Country.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Country.EndPoint.js";
import cityRouter from '../City/City.router.js';
asyncHandler
const router = Router();
router.use('/city', cityRouter);
// router.post('/',fileUpload(fileValidation.image).single('image'),validation(validators.createCountry),asyncHandler(countryController.createCountry)) 
router.post('/', auth(endPoint.create), validation(validators.createCountry),asyncHandler(countryController.createCountry));
router.put('/:countryId', auth(endPoint.update), validation(validators.updateCountry),asyncHandler(countryController.updateCountry));
router.delete('/:countryId', auth(endPoint.delete), validation(validators.deleteCountry),asyncHandler(countryController.deleteCountry));
router.get('/one/:countryId', auth(endPoint.get), validation(validators.getCountry),asyncHandler(countryController.getCountry));
router.get('/', auth(endPoint.get), validation(validators.getCountries),asyncHandler(countryController.getCountries));
export default router;
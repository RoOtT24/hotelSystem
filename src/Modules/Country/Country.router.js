import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multer.js";
import * as countryController from './Controller/Country.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Country.validation.js';
import validation from "../../Middleware/validation.js";
asyncHandler
const router = Router();
router.post('/',fileUpload(fileValidation.image).single('image'),validation(validators.createCountry),asyncHandler(countryController.createCountry)) 
export default router;
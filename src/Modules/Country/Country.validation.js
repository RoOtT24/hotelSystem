import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
export const createCountry = joi.object({
   name: joi.string().min(2).max(20).required(),
   file: generalFields.file.required(),

}).required();
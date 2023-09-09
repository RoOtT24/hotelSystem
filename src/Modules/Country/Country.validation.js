import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createCountry = joi.object({
   name: joi.string().min(2).max(20).required(),
   lat:  joi.number().min(-90).max(90).required(),
   lng:  joi.number().min(-180).max(180).required(),
}).required();

export const updateCountry = joi.object({
   name: joi.string().min(2).max(20),
   lat:  joi.number().min(-90).max(90),
   lng:  joi.number().min(-180).max(180),
   countryId: generalFields.id.required(),
}).required();

export const deleteCountry = joi.object({
   countryId: generalFields.id.required()
}).required();

export const getCountry = joi.object({
   countryId: generalFields.id.required()
}).required()

export const getCountries = joi.object({
   size:joi.number().min(1).max(30),
   page:joi.number().min(1),
   sort:joi.string(),
   search:joi.string(),
}).required()


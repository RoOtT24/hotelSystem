import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createCity = joi.object({
   name: joi.string().min(2).max(20).required(),
   lat:  joi.number().min(-90).max(90).required(),
   lng:  joi.number().min(-180).max(180).required(),
   countryId: generalFields.id.required(),
}).required();

export const updateCity = joi.object({
   name: joi.string().min(2).max(20),
   lat:  joi.number().min(-90).max(90),
   lng:  joi.number().min(-180).max(180),
   cityId: generalFields.id.required(),
   countryId: generalFields.id.required(),
}).required();

export const deleteCity = joi.object({
   cityId: generalFields.id.required(),
   countryId: generalFields.id.required(),
}).required();

export const getCity = joi.object({
   cityId: generalFields.id.required(),
   countryId: generalFields.id.required(),
}).required()

export const getCities = joi.object({
}).required()


export const getCitiesInCountry = joi.object({
   countryId: generalFields.id.required(),
}).required()


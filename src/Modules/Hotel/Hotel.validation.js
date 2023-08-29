import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createHotel = joi.object({
   name: joi.string().min(2).max(20).required(),
   files:joi.object({mainImage:joi.array().items(generalFields.file).required(), subImages:joi.array().items(generalFields.file)}).required(),
   lat:  joi.number().min(-90).max(90).required(),
   lng:  joi.number().min(-180).max(180).required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
}).required();

export const updateHotel = joi.object({
   name: joi.string().min(2).max(20),
   lat:  joi.number().min(-90).max(90),
   lng:  joi.number().min(-180).max(180),
   hotelId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
   files:joi.object({mainImage:joi.array().items(generalFields.file).required(), subImages:joi.array().items(generalFields.file)}),
}).required();

export const deleteHotel = joi.object({
   hotelId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
}).required();

export const getHotel = joi.object({
   hotelId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
}).required()

export const getHotels = joi.object({
}).required()


export const getHotelsInCity = joi.object({
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
}).required()

export const getHotelsInRegion = joi.object({
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
}).required()

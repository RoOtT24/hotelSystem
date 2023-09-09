import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createRegion = joi.object({
   name: joi.string().min(2).max(20).required(),
   lat:  joi.number().min(-90).max(90).required(),
   lng:  joi.number().min(-180).max(180).required(),
   countryId: generalFields.id.required(),
   // zipCode: joi.number().min(3).max(5).required(),
   cityId: generalFields.id.required(),
}).required();

export const updateRegion = joi.object({
   name: joi.string().min(2).max(20),
   lat:  joi.number().min(-90).max(90),
   lng:  joi.number().min(-180).max(180),
   // zipCode: joi.number().min(3).max(5),
   regionId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
}).required();

export const deleteRegion = joi.object({
   regionId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
}).required();

export const getRegion = joi.object({
   regionId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
}).required()

export const getRegions = joi.object({
   size:joi.number().min(1),
   page:joi.number().min(1),
   sort:joi.string(),
   search:joi.string(),
}).required()


export const getRegionsInCity = joi.object({
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
}).required()


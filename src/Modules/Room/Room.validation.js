import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const createRoom = joi.object({
   name: joi.string().min(2).max(20).required(),
   files:joi.object({mainImage:joi.array().items(generalFields.file).required(), subImages:joi.array().items(generalFields.file)}).required(),
   type: joi.string().valid('Suite', 'Luxury', 'Deluxe', 'Premium'),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
   hotelId: generalFields.id.required(),
   hasWifi:joi.boolean(),
   hasSeaView:joi.boolean(),
   hasAc:joi.boolean(),
   hasBreakFast:joi.boolean(),
   numberOfTwinBeds:joi.number().min(0).max(8).required(), 
   numberOfQueenBeds:joi.number().min(0).max(1).required(), 
   numberOfFullBeds:joi.number().min(0).max(1).required(), 
   numberOfKingBeds:joi.number().min(0).max(1).required(), 
   nightPrice:joi.number().min(0).required(),
   discountPerDay:joi.number().min(0).max(15).required(),
}).required();

export const updateRoom = joi.object({
   name: joi.string().min(2).max(20),
   files:joi.object({mainImage:joi.array().items(generalFields.file), subImages:joi.array().items(generalFields.file)}),
   type: joi.string().valid('Suite', 'Luxury', 'Deluxe', 'Premium'),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
   roomId: generalFields.id.required(),
   hotelId: generalFields.id.required(),
   hasWifi:joi.boolean(),
   hasSeaView:joi.boolean(),
   hasAc:joi.boolean(),
   hasBreakFast:joi.boolean(),
   numberOfTwinBeds:joi.number().min(0).max(8), 
   numberOfQueenBeds:joi.number().min(0).max(1), 
   numberOfFullBeds:joi.number().min(0).max(1), 
   numberOfKingBeds:joi.number().min(0).max(1), 
   nightPrice:joi.number().min(0),
   discountPerDay:joi.number().min(0).max(15),
}).required();

export const deleteRoom = joi.object({
   roomId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
   hotelId: generalFields.id.required(),
}).required();

export const getRoom = joi.object({
   roomId: generalFields.id.required(),
   countryId: generalFields.id.required(),
   cityId: generalFields.id.required(),
   regionId: generalFields.id.required(),
   hotelId: generalFields.id.required(),
}).required()

export const getRooms = joi.object({
   size:joi.number().min(1),
   page:joi.number().min(1),
   sort:joi.string(),
   search:joi.string(),
}).required()


export const getRoomsInHotel = joi.object({
   hotelId: generalFields.id.required(),
}).required()

// 

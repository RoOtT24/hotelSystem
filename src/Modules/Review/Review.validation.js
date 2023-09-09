import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createReview = joi.object({
    goodReview:joi.string().min(2).max(1000).required(),
    badReview:joi.string().min(2).max(1000).required(),
    roomId:generalFields.id.required(),
    staff:joi.number().min(1).max(5).required(),
    facilities:joi.number().min(1).max(5).required(),
    cleanliness:joi.number().min(1).max(5).required(),
    comfort:joi.number().min(1).max(5).required(),
    valueForMoney:joi.number().min(1).max(5).required(),
    location:joi.number().min(1).max(5).required(),
    files:joi.object({images:joi.array().items(generalFields.file)}),
}).required();


export const updateReview = joi.object({
    // body:{
    comment:joi.string().min(2).max(80),
    productId:generalFields.id.required(),
    rating:joi.number().min(1).max(5),
    reviewId:generalFields.id.required()
// },
}).required();


export const getSpecificReview = joi.object({
    catId:generalFields.id.required(),
}).required();

export const getReviews = joi.object({
    hotelId:generalFields.id.required(),
    size:joi.number().min(1),
    page:joi.number().min(1),
}).required();

export const deleteReview = joi.object({
    hotelId:generalFields.id.required(),
}).required();
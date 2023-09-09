import joi from 'joi'
import { generalFields } from '../../Middleware/validation.js';


export const createCoupon = joi.object({
    // body:{
    name:joi.string().min(2).max(20).required(),
    amount:joi.number().positive().min(1).max(100).required(),
    expireDate:joi.required(),
// },
}).required();


export const updateCoupon = joi.object({
    // body:{
    name:joi.string().min(2).max(20),
    amount:joi.number().positive().min(1).max(100),
    expireDate:joi.date(),
    couponId:generalFields.id,
// },
}).required();


export const getSpecificCoupon = joi.object({
    couponId:generalFields.id.required(),
}).required();

export const getCoupons = joi.object({
    size:joi.number().min(1),
    page:joi.number().min(1),
    price:joi.object(),
    stock:joi.object(),
    sort:joi.string(),
    search:joi.string(),
}).required();


export const deleteCoupon = joi.object({
    couponId:generalFields.id.required(),
});
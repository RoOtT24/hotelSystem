import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";


export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();


  export const refresh = joi.object({
    refreshToken: generalFields.refreshToken.required()
  })


  export const sendCode = joi.object({
    email: generalFields.email.required(),
  });

  export const forgetPassword = joi.object({
    email: generalFields.email.required(),
    password:generalFields.password.required(),
    code:joi.string().min(4).max(4).required(),
    cPassword:joi.any().valid(joi.ref('password')).required().messages({
      "any.only":"Does not match password"})
  });

  export const signup = joi.object({
    userName:joi.string().min(3).max(40).required(),
    email: generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:joi.any().valid(joi.ref('password')).required().messages({
      "any.only":"Does not match password"})
  });

  export const createAdmin = joi.object({
    userName:joi.string().min(3).max(40).required(),
    email: generalFields.email.required(),
    password:generalFields.password.required(),
    cPassword:joi.any().valid(joi.ref('password')).required().messages({
      "any.only":"Does not match password"})
  });


  export const confirmEmail = joi.object({
    token:joi.string().required(),
  })
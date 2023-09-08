import { generalFields } from "../../Middleware/validation.js";
import joi from "joi";

export const profilePic = joi.object({
  file: generalFields.file.required(),
});

export const updatePassword = joi
  .object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password.invalid(joi.ref("oldPassword")),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

export const shareProfile = joi
  .object({
    id: generalFields.id,
  })
  .required();



  export const changeRole = joi.object({
    id: generalFields.id.required(),
    role: generalFields.role.required(),
  })


  export const coverPic = joi.object({
    files:joi.object({0:generalFields.file,1:generalFields.file,2:generalFields.file,3:generalFields.file}),
  });
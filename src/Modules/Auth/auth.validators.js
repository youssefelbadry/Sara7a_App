import Joi from "joi";
import { genderschema } from "../../DB/Models/user.model.js";
import { generalField } from "../../Middlewares/validate.middleware.js";

export const signupSchema = {
  body: Joi.object({
    firstName: generalField.firstName.required(),

    lastName: generalField.lastName.required(),
    email: generalField.email.required(),

    password: generalField.password.required(),

    confirmPassword: generalField.confirmPassword.required(),

    gender: generalField.gender.required(),

    phone: generalField.phone.required(),
    role: generalField.role,
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: generalField.email.required(),

    password: generalField.password.required(),
  }),
};

export const confirmEmailSchema = {
  body: Joi.object({
    email: generalField.email.required(),

    otp: generalField.otp.required(),
  }),
};
export const verifyTwoFaSchema = {
  body: Joi.object({
    email: generalField.email.required(),

    otp: generalField.otp.required(),
  }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalField.email.required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: generalField.email.required(),
    password: generalField.password,
    otp: generalField.otp.required(),
  }),
};
export const updatePasswordSchema = {
  body: Joi.object({
    email: generalField.email.required(),
    password: generalField.password,
    newPassword: Joi.string()
      .messages({
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
      })
      .required(),
    confirmNewPassword: Joi.string()
      .messages({
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
      })
      .required(),
  }),
};

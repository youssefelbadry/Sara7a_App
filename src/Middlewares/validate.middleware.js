import Joi from "joi";
import { Types } from "mongoose";
import { genderschema, roleEnum } from "../DB/Models/user.model.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const validatorError = [];

    for (const key of Object.keys(schema)) {
      const validaionResults = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validaionResults.error) {
        validatorError.push({ key, details: validaionResults.error.details });
      }
    }

    if (validatorError.length) {
      res
        .status(400)
        .json({ message: "Validation Error", details: validatorError });
    }

    return next();
  };
};

export const generalField = {
  firstName: Joi.string().min(2).max(20).messages({
    "string.base": "First name must be a text value",
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 20 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().min(2).max(20).messages({
    "string.base": "Last name must be a text value",
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 20 characters",
    "any.required": "Last name is required",
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 5,
      tlds: { allow: ["com", "net", "eg"] },
    })

    .messages({
      "string.base": "Email must be a text value",
      "string.email":
        "Please enter a valid email address (e.g. user@example.com)",
      "any.required": "Email is required",
    }),

  password: Joi.string().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.any().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),

  gender: Joi.string()
    .valid(...Object.values(genderschema))
    .default(genderschema.MALE)
    .messages({
      "any.only": `Gender must be one of the following: ${Object.values(
        genderschema
      ).join(", ")}`,
    }),

  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)

    .messages({
      "string.pattern.base":
        "Please enter a valid Egyptian phone number (e.g. 010xxxxxxxx)",
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
    }),
  role: Joi.string()
    .valid(...Object.values(roleEnum))
    .default(roleEnum.USER)
    .messages({
      "any.only": `Role must be one of the following: ${Object.values(
        roleEnum
      ).join(" , ")}`,
    }),

  otp: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),
  id: Joi.string().custom((value, helper) => {
    return (
      Types.ObjectId.isValid(value) || helper.message("Invalid objectId Format")
    );
  }),

  file: {
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    destination: Joi.string(),
    mimetype: Joi.string(),
    size: Joi.number().positive(),
    filename: Joi.string(),
    path: Joi.string(),
    finalPath: Joi.string(),
  },
};

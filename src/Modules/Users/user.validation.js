import Joi from "joi";
import { generalField } from "../../Middlewares/validate.middleware.js";
import { filterFileTypes } from "../../Utils/Multer/typesOfFiles.multer.js";

export const profileImageShcema = {
  file: Joi.object({
    fieldname: generalField.file.fieldname.required(),
    originalname: generalField.file.originalname.required(),
    encoding: generalField.file.encoding.required(),
    destination: generalField.file.destination.required(),
    mimetype: generalField.file.mimetype
      .valid(...filterFileTypes.images)
      .required(),
    size: generalField.file.size.max(5 * 1024 * 1024).required(),
    filename: generalField.file.filename.required(),
    path: generalField.file.path.required(),
    finalPath: generalField.file.finalPath.required(),
  }).required(),
};

export const coverImageShcema = {
  file: Joi.object({
    fieldname: generalField.file.fieldname.required(),
    originalname: generalField.file.originalname.required(),
    encoding: generalField.file.encoding.required(),
    destination: generalField.file.destination.required(),
    mimetype: generalField.file.mimetype
      .valid(...filterFileTypes.images)
      .required(),
    size: generalField.file.size.max(5 * 1024 * 1024).required(),
    filename: generalField.file.filename.required(),
    path: generalField.file.path.required(),
    finalPath: generalField.file.finalPath.required(),
  }).required(),
};
export const freezeAccountSchema = {
  params: Joi.object({
    userId: Joi.string().optional(),
  }),
};
export const restoreAccountSchema = {
  params: Joi.object({
    userId: Joi.string().optional(),
  }),
};

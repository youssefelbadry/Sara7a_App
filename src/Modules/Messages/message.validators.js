import Joi from "joi";

import { generalField } from "../../Middlewares/validate.middleware.js";

export const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().min(2).max(500).required(),
  }),
  params: Joi.object({
    receiverId: generalField.id.required(),
  }),
};

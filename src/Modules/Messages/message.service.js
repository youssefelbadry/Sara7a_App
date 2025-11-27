import userModel, { statuEnum } from "../../DB/Models/user.model.js";
import { SuccessResponse } from "../../Utils/Errors/SuccessResponse.utils.js";
import * as dbService from "../../DB/dbService.js";
import {
  asymmtrecEncrypt,
  encrypt,
} from "../../Utils/Encryption/encryption.utils.js";
import { compare, hash } from "../../Utils/Hashing/hash.utils.js";
import { eventEmitter } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { generateToken, virifyToken } from "../../Utils/Tokens/token.util.js";
import { v4 as uuid } from "uuid";
import TokenModel from "../../DB/Models/token.model.js";
import moment from "moment/moment.js";
import { generateOTP } from "../../Utils/Emails/generateOTP.email.js";
import MessageModel from "../../DB/Models/message.model.js";

export const sendMessage = async (req, res, next) => {
  const { content } = req.body;
  const { receiverId } = req.params;

  const user = await dbService.findById({
    model: userModel,
    id: receiverId,
  });
  if (!user) return next(new Error("User not founded", { cause: 404 }));

  const message = await dbService.create({
    model: MessageModel,
    data: {
      content,
      receiverId: user._id,
    },
  });

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Message sent sucessfuly",
    data: { message },
  });
};

export const getAllMessage = async (req, res, next) => {
  const message = await dbService.find({
    model: MessageModel,
    populate: [
      { path: "receiverId", select: "firstName lastName email gender _id" },
    ],
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Message fetched sucessfuly",
    data: { message },
  });
};

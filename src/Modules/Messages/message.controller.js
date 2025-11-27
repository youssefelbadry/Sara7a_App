import { Router } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middlewares/validate.middleware.js";
import { sendMessageSchema } from "./message.validators.js";
import {
  authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import { roleEnum } from "../../DB/Models/user.model.js";

const router = Router();

router.post(
  "/sendMessage/:receiverId",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(sendMessageSchema),
  messageService.sendMessage
);
router.post("/getAllMessage", messageService.getAllMessage);

export default router;

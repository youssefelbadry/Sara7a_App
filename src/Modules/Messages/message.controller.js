import { Router } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middlewares/validate.middleware.js";
import { sendMessageSchema } from "./message.validators.js";

const router = Router();

router.post(
  "/sendMessage/:receiverId",
  validation(sendMessageSchema),
  messageService.sendMessage
);
router.post("/getAllMessage", messageService.getAllMessage);

export default router;

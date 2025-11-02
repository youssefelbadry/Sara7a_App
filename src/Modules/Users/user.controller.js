import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
import { localFileUploud } from "../../Utils/Multer/local.multer.util.js";

const router = Router();

router.get("/getAll", userService.getAll);
router.patch("/updateProfile", authentication, userService.updateProfile);
router.patch(
  "/profile-image",
  authentication,
  localFileUploud().single("profileImage"),
  userService.profileImage
);
export default router;

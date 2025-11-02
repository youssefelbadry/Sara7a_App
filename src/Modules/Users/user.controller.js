import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
const router = Router();

router.get("/getAll", userService.getAll);
router.patch("/updateProfile", authentication, userService.updateProfile);
export default router;

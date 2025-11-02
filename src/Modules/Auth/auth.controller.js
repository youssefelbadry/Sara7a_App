import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
import { validation } from "../../Middlewares/validate.middleware.js";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.validators.js";
import { localFileUploud } from "../../Utils/Multer/local.multer.util.js";

const router = Router();

router.post("/signup", validation(signupSchema), authService.signUp);
router.post("/login", validation(loginSchema), authService.login);
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  authService.confirmEmail
);
router.post("/logout", authentication, authService.logout);
router.post("/refreshToken", authService.refreshToken);
router.patch(
  "/forget-password",
  validation(forgetPasswordSchema),
  authService.forgetPassword
);
router.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  authService.resetPassword
);
router.post(
  "/social-login",
  // validation(resetPasswordSchema),
  authService.loginWithGmail
);

router.post(
  "/profile-image",
  authentication,
  localFileUploud().single("profileImage"),
  authService.profileImage
);
export default router;

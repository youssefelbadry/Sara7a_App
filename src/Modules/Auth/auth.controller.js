import { Router } from "express";
import * as authService from "./auth.service.js";
import {
  authentication,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import { validation } from "../../Middlewares/validate.middleware.js";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updatePasswordSchema,
  verifyTwoFaSchema,
} from "./auth.validators.js";

const router = Router();

router.post("/signup", validation(signupSchema), authService.signUp);
router.post("/login", validation(loginSchema), authService.login);
router.post(
  "/verify-Two-Fa",
  validation(verifyTwoFaSchema),
  authService.verifyTwoFaOTP
);
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  authService.confirmEmail
);
router.post(
  "/logout",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authService.logout
);
router.post(
  "/refreshToken",
  authentication({ tokenType: tokenTypeEnum.REFRESH }),
  authService.refreshToken
);
router.patch(
  "/updatePassword",
  validation(updatePasswordSchema),
  authService.updatePassword
);
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

export default router;

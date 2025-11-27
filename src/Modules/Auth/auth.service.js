import userModel, { providerEnum } from "../../DB/Models/user.model.js";
import { SuccessResponse } from "../../Utils/Errors/SuccessResponse.utils.js";
import * as dbService from "../../DB/dbService.js";
import {
  asymmtrecEncrypt,
  encrypt,
} from "../../Utils/Encryption/encryption.utils.js";
import { compare, hash } from "../../Utils/Hashing/hash.utils.js";
import { eventEmitter } from "../../Utils/Events/email.event.utils.js";
import {
  generateToken,
  getNewLoginCredientials,
  virifyToken,
} from "../../Utils/Tokens/token.util.js";
import { v4 as uuid } from "uuid";
import TokenModel from "../../DB/Models/token.model.js";
import moment from "moment/moment.js";
import { generateOTP } from "../../Utils/Emails/generateOTP.email.js";
import { OAuth2Client } from "google-auth-library";

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    gender,
    phone,
    role,
  } = req.body;

  const exsistEmail = await dbService.findOne({
    model: userModel,
    filter: { email },
  });
  if (exsistEmail) {
    return next(new Error("User already exsist", { cause: 409 }));
  }
  // let encryptedPhone = encrypt(phone);
  const { otp, hashedOtp } = await generateOTP();
  const user = await dbService.create({
    model: userModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: await hash({ planText: password }),
        confirmPassword: await hash({ planText: confirmPassword }),
        gender,
        confirmEmailOtp: hashedOtp,
        otpExpiresAt: Date.now() + parseInt(process.env.EXIPIRESIN_OTP),
        phone: asymmtrecEncrypt(phone),
        role,
      },
    ],
  });

  eventEmitter.emit("confirmEmail", { to: email, otp, firstName });
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "User is created sucessfuly",
    data: { user },
  });
};

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;

  const checkuser = await dbService.findOne({
    model: userModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      confirmEmailOtp: { $exists: true },
    },
  });

  if (!checkuser) {
    return next(
      new Error("User not found or already confirmed", { cause: 404 })
    );
  }

  if (moment().isAfter(checkuser.otpExpiresAt)) {
    const { otp, hashedOtp } = await generateOTP();

    await dbService.updateOne({
      model: userModel,
      filter: { email },
      data: {
        confirmEmailOtp: hashedOtp,
        otpExpiresAt: Date.now() + parseInt(process.env.EXIPIRESIN_OTP),
      },
    });
    eventEmitter.emit("confirmEmail", {
      to: email,
      otp,
      firstName: checkuser.firstName,
    });

    return next(
      new Error("Your code has expired. We've sent a new one to your email.", {
        cause: 404,
      })
    );
  }
  if (!(await compare({ planText: otp, hash: checkuser.confirmEmailOtp }))) {
    return next(new Error("Invalid OTP", { cause: 401 }));
  }

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOtp: 1 },
      $inc: { __v: 1 },
    },
  });
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "User confirmed successfully",
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const checkuser = await dbService.findOne({
    model: userModel,
    filter: { email },
  });
  if (!checkuser) {
    return next(new Error("Invalid email or password", { cause: 404 }));
  }

  if (!(await compare({ planText: password, hash: checkuser.password }))) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }
  if (!checkuser.confirmEmail) {
    return next(new Error("Confirm your email", { cause: 400 }));
  }

  const { otp, hashedOtp } = await generateOTP();

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      loginOTP: hashedOtp,
      loginOTPExpiresAt: Date.now() + parseInt(process.env.EXIPIRESIN_OTP),
    },
  });

  eventEmitter.emit("2FA-Login-OTP", {
    to: email,
    otp,
    firstName: checkuser.firstName,
  });

  return SuccessResponse({
    res,
    message: "OTP sent to your email",
    data: { need2FA: true },
  });
};

export const verifyTwoFaOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await dbService.findOne({ model: userModel, filter: { email } });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (!user.loginOTP)
    return next(new Error("Please login again", { cause: 400 }));

  if (moment().isAfter(user.loginOTPExpiresAt)) {
    return next(new Error("OTP expired, please login again", { cause: 400 }));
  }

  const valid = await compare({ planText: otp, hash: user.loginOTP });
  if (!valid) return next(new Error("Invalid OTP", { cause: 401 }));

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      $unset: { loginOTP: 1, loginOTPExpiresAt: 1, pendingDeviceId: 1 },
      trustedDevices: { addedAt: new Date() },
    },
  });

  const Credientials = await getNewLoginCredientials(checkuser, deviceId);
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "User loggin Sucessfuly",
    data: { Credientials, virifyDevice: true },
  });
};

export const logout = async (req, res, next) => {
  await dbService.create({
    model: TokenModel,
    data: {
      jwtid: req.decoded.jti,
      expiresIn: new Date(req.decoded.exp * 1000),
      userId: req.user._id,
    },
  });

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Logged out Sucessfuly",
  });
};

export const refreshToken = async (req, res, next) => {
  const { user } = req.user;
  const deviceId = req.headers.deviceId;

  const Credientials = await getNewLoginCredientials(user, deviceId);

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Token refreshed Sucessfuly",
    data: { Credientials },
  });
};
export const updatePassword = async (req, res, next) => {
  const { email, password, newPassword, confirmNewPassword } = req.body;

  const user = await dbService.findOne({
    model: userModel,
    filter: { email, confirmEmail: { $exists: true } },
  });
  if (!user)
    return next(new Error("User not founded or not confirmed", { cause: 404 }));

  if (!(await compare({ planText: password, hash: user.password }))) {
    return next(new Error("Invalid current password", { cause: 401 }));
  }
  if (newPassword !== confirmNewPassword)
    return next(new Error("New passwords do not match", { cause: 401 }));

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      password: await hash({ planText: newPassword }),
    },
  });

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Updated password is successfully",
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const { otp, hashedOtp } = await generateOTP();
  const user = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { email, confirmEmail: { $exists: true } },
    data: {
      forgetPasswordOTP: hashedOtp,
    },
  });
  if (!user)
    return next(new Error("User not found or not confirm", { cause: 400 }));

  eventEmitter.emit("forgetpassword", {
    to: email,
    otp,
    firstName: user.firstName,
  });

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Check your box",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  const user = await dbService.findOne({
    model: userModel,
    filter: {
      email,
      forgetPasswordOTP: { $exists: true },
      confirmEmail: { $exists: true },
    },
  });
  if (!user) return next(new Error("Invalid your account", { cause: 404 }));

  if (!(await compare({ planText: otp, hash: user.forgetPasswordOTP })))
    return next(new Error("Invalid email or password", { cause: 401 }));

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      password: await hash({ planText: password }),
      $unset: { forgetPasswordOTP: true },
      $inc: { __v: 1 },
    },
  });

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Password updated Sucessfuly",
  });
};

async function VerifyTheGoogleIdToken({ idToken }) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLINT_ID,
  });
  const payloud = ticket.getPayload();
  return payloud;
}

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name } =
    await VerifyTheGoogleIdToken({ idToken });

  if (!email_verified)
    return next(new Error("Email not verified", { cause: 401 }));

  const user = await dbService.findOne({
    model: userModel,
    filter: { email },
  });

  if (user) {
    if (user.provider === providerEnum.GOOGLE) {
      const userToken = generateToken({
        payloud: { id: user._id, email: user.email },
        secretKey: process.env.SECRET_KEY_TOKEN,
        options: {
          expiresIn: parseInt(process.env.EXIPIRESIN_TOKEN),
          jwtid: uuid(),
        },
      });
      const refreshToken = generateToken({
        payloud: { id: user._id, email: user.email },
        secretKey: process.env.SECRET_KEY_REFRESH_TOKEN,
        options: {
          expiresIn: parseInt(process.env.EXIPIRESIN_REFRESh_TOKEN),
          jwtid: uuid(),
        },
      });
      return SuccessResponse({
        res,
        statusCode: 201,
        message: "User loggin Sucessfuly",
        data: { userToken, refreshToken },
      });
    }
  }

  const newUser = await dbService.create({
    model: userModel,
    data: {
      firstName: given_name,
      lastName: family_name,
      email,
      confirmEmail: Date.now(),
      provider: providerEnum.GOOGLE,
    },
  });
  const Credientials = await getNewLoginCredientials(newUser);
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "User loggin Sucessfuly",
    data: { Credientials },
  });
};

import { customAlphabet } from "nanoid";
import { hash } from "../Hashing/hash.utils.js";

export const generateOTP = async () => {
  const otp = customAlphabet(process.env.OTP, 6)();
  const hashedOtp = await hash({ planText: otp });
  return { otp, hashedOtp };
};

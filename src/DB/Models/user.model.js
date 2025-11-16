import mongoose from "mongoose";

export const genderschema = {
  MALE: "male",
  FEMALE: "female",
};
export const providerEnum = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
};
export const roleEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};
const userShcema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [20, "First name must be at most 20 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [20, "First name must be at most 20 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // required: true,
    },
    confirmPassword: {
      type: String,
      // required: true,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderschema),
        message: "{Value} is not a valid gender",
      },
      default: genderschema.MALE,
    },
    provider: {
      type: String,
      enum: {
        values: Object.values(providerEnum),
        message: "{Value} is not a valid provider",
      },
      default: providerEnum.SYSTEM,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: "{Value} is not a valid role",
      },
      default: roleEnum.USER,
    },
    phone: String,
    profileImage: String,
    coverImages: [String],
    cloudProfileImage: { public_id: String, secure_url: String },
    cloudCoverImages: [{ public_id: String, secure_url: String }],
    confirmEmail: Date || Boolean,
    newPassword: String,
    confirmNewPassword: String,
    confirmEmailOtp: String,
    otpExpiresAt: Date || Boolean,
    forgetPasswordOTP: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userShcema.virtual("messages", {
  localField: "_id",
  foreignField: "receiverId",
  ref: "Message",
});

const userModel = mongoose.models.User || mongoose.model("User", userShcema);
export default userModel;

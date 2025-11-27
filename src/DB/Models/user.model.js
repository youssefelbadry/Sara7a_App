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
export const statuEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
const userShcema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    confirmPassword: { type: String },
    gender: {
      type: String,
      enum: Object.values(genderschema),
      default: genderschema.MALE,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.SYSTEM,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.USER,
    },

    trustedDevices: [
      {
        deviceId: String,
        addedAt: Date,
      },
    ],

    loginOTP: String,
    loginOTPExpiresAt: Date,

    phone: String,
    profileImage: String,
    coverImages: [String],
    cloudProfileImage: { public_id: String, secure_url: String },

    freezeAt: Date,
    freezeBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    restoreAt: Date,
    restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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

userShcema.virtual("status").get(function () {
  return this.deletedAt || this.freezeAt
    ? statuEnum.INACTIVE
    : statuEnum.ACTIVE;
});

userShcema.virtual("messages", {
  localField: "_id",
  foreignField: "receiverId",
  ref: "Message",
});

const userModel = mongoose.models.User || mongoose.model("User", userShcema);
export default userModel;

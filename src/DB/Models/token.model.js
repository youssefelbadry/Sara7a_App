import mongoose from "mongoose";

const tokenShcema = new mongoose.Schema(
  {
    jwtid: {
      type: String,
      require: true,
      unique: true,
    },
    expiresIn: {
      type: Date,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const TokenModel =
  mongoose.models.Token || mongoose.model("Token", tokenShcema);
export default TokenModel;

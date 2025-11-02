import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: [2, "Message must be at least 2 characters long"],
      maxLength: [500, "Message must be at most 500 characters long"],
      require: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default MessageModel;

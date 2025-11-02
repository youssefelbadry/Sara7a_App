import userController from "./Modules/Users/user.controller.js";
import messageController from "./Modules/Messages/message.controller.js";
import authController from "./Modules/Auth/auth.controller.js";
import connectionDB from "./DB/connection.js";
import { globalErrorHandler } from "./Utils/Errors/errorHandler.utils.js";
import cors from "cors";
const bootstrap = async (app, express) => {
  app.use(express.json());
  app.use(cors());

  await connectionDB();
  app.use("/api/v1/users", userController);
  app.use("/api/v1/messages", messageController);
  app.use("/api/v1/auth", authController);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({ message: "Not found handeling" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;

import userController from "./Modules/Users/user.controller.js";
import messageController from "./Modules/Messages/message.controller.js";
import authController from "./Modules/Auth/auth.controller.js";
import connectionDB from "./DB/connection.js";
import { globalErrorHandler } from "./Utils/Errors/errorHandler.utils.js";
import cors from "cors";
import path from "node:path";
import { attachRouterWithLoggers } from "./Utils/loggers/logg.utils.js";
import helmet from "helmet";
import { corOptions } from "./Utils/Cors/cor.util.js";
import rateLimit from "express-rate-limit";
const bootstrap = async (app, express) => {
  app.use(express.json());
  app.use(cors(corOptions()));
  app.use(helmet());
  const limitRate = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10000,
    message: {
      statusCode: 429,
      message: "To many request , please try again later",
    },
    legacyHeaders: true,
  });
  app.use(limitRate);
  await connectionDB();
  attachRouterWithLoggers(app, "/api/v1/users", userController, "users.log");
  attachRouterWithLoggers(app, "/api/v1/auth", authController, "auth.log");
  attachRouterWithLoggers(
    app,
    "/api/v1/messages",
    messageController,
    "messages.log"
  );
  app.use("/uploads", express.static(path.resolve("./src/uploads")));
  app.use("/api/v1/users", userController);
  app.use("/api/v1/messages", messageController);
  app.use("/api/v1/auth", authController);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({ message: "Not found handeling" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;

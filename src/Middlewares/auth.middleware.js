import { virifyToken } from "../Utils/Tokens/token.util.js";
import * as dbService from "../DB/dbService.js";
import TokenModel from "../DB/Models/token.model.js";
import userModel from "../DB/Models/user.model.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("authorization token is missing", { cause: 400 }));
  }
  if (!authorization.startsWith(process.env.START_WITH)) {
    return next(
      new Error("Invalid authorization token format", { cause: 400 })
    );
  }
  const token = authorization.split(" ")[1];
  const decoded = virifyToken({
    token,
    secretKey: process.env.SECRET_KEY_TOKEN,
  });

  if (!decoded.jti) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  const revockedToken = await dbService.findOne({
    model: TokenModel,
    filter: { jwtid: decoded.jti },
  });

  if (revockedToken) {
    return next(new Error("Token is revoced", { cause: 401 }));
  }

  const user = await dbService.findById({
    model: userModel,
    id: decoded.id,
  });

  if (!user) {
    return next(new Error("User not founded", { cause: 404 }));
  }
  req.user = user;
  req.decoded = decoded;
  next();
};

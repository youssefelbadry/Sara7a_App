import { getSignature, virifyToken } from "../Utils/Tokens/token.util.js";
import * as dbService from "../DB/dbService.js";
import TokenModel from "../DB/Models/token.model.js";
import userModel, { statuEnum } from "../DB/Models/user.model.js";

export const tokenTypeEnum = {
  ACCESS: "ACCESS",
  REFRESH: "REFRESH",
};

export const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.ACCESS,
  next,
} = {}) => {
  const [Baarer, token] = authorization.split(" ") || [];
  if (!Baarer || !token)
    return next(new Error("Invalid token", { cause: 400 }));

  let signature = await getSignature({ signetureLevel: Baarer });
  const decoded = virifyToken({
    token,
    secretKey:
      tokenType === tokenTypeEnum.ACCESS
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  if (!decoded.jti) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  const revockedToken = await dbService.findOne({
    model: TokenModel,
    filter: { jwtid: decoded.jti },
  });

  if (revockedToken) {
    return next(new Error("Token is revoked", { cause: 401 }));
  }

  const user = await dbService.findById({
    model: userModel,
    id: decoded.id,
  });
  console.log(user, user.status);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.status === statuEnum.INACTIVE)
    return next(new Error("Your account is not active"));

  return { user, decoded };
};

export const authentication = ({ tokenType = tokenTypeEnum.ACCESS }) => {
  return async (req, res, next) => {
    const { user, decoded } =
      (await decodedToken({
        authorization: req.headers.authorization,
        tokenType,
        next,
      })) || {};

    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRole = [] } = {}) => {
  return (req, res, next) => {
    if (!accessRole.includes(req.user.role)) {
      return next(new Error("Unauthorized Access", { cause: 403 }));
    }
    next();
  };
};

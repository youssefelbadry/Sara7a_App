import jwt from "jsonwebtoken";
// import { accessSync } from "node:fs";
import { roleEnum } from "../../DB/Models/user.model.js";
import { v4 as uuid } from "uuid";

const signatureEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const generateToken = ({
  payloud,
  secretKey = process.env.SECRET_KEY_TOKEN,
  options = { expiresIn: process.env.EXIPIRESIN_TOKEN },
}) => {
  return jwt.sign(payloud, secretKey, options);
};

export const virifyToken = ({
  token,
  secretKey = process.env.SECRET_KEY_TOKEN,
}) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = async ({ signetureLevel = signatureEnum.USER }) => {
  let signeture = { accessSignature: undefined, refreshSignature: undefined };

  switch (signetureLevel) {
    case signatureEnum.ADMIN:
      signeture.accessSignature = process.env.SECRET_KEY_ADMIN_TOKEN;
      signeture.refreshSignature = process.env.SECRET_KEY_ADMIN_REFRESH_TOKEN;
      break;
    default:
      signeture.accessSignature = process.env.SECRET_KEY_USER_TOKEN;
      signeture.refreshSignature = process.env.SECRET_KEY_USER_REFRESH_TOKEN;
      break;
  }
  return signeture;
};

export const getNewLoginCredientials = async (user) => {
  const signature = await getSignature({
    signetureLevel:
      user.role != roleEnum.USER ? signatureEnum.ADMIN : signatureEnum.USER,
  });

  const jwtid = uuid();

  const userToken = generateToken({
    payloud: {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    secretKey: signature.accessSignature,
    options: {
      expiresIn: parseInt(process.env.EXIPIRESIN_TOKEN),
      jwtid,
    },
  });
  const refreshToken = generateToken({
    payloud: {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn: parseInt(process.env.EXIPIRESIN_REFRESh_TOKEN),
      jwtid,
    },
  });

  return { userToken, refreshToken };
};

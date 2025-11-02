import jwt from "jsonwebtoken";

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

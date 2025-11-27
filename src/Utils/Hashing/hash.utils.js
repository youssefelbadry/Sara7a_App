import bcrypt from "bcrypt";

export const hash = async ({
  planText = "",
  saltRound = Number(process.env.SALTROUND),
}) => {
  return bcrypt.hash(planText, saltRound);
};

export const compare = async ({ planText = "", hash = "" }) => {
  return bcrypt.compare(planText, hash);
};

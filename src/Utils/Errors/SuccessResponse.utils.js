export const SuccessResponse = ({
  res,
  statusCode = 200,
  message = "Done",
  data = {},
}) => {
  res.status(statusCode).json({ message, data });
};

import userModel from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { asymmtrecDecrypt } from "../../Utils/Encryption/encryption.utils.js";
import { SuccessResponse } from "../../Utils/Errors/SuccessResponse.utils.js";
import { compare, hash } from "../../Utils/Hashing/hash.utils.js";

export const getAll = async (req, res, next) => {
  let users = await dbService.find({
    model: userModel,
    populate: [{ path: "messages" }],
  });

  users = users.map((user) => {
    return { ...user._doc, phone: asymmtrecDecrypt(user.phone) };
  });

  if (users === 0) {
    return next(new Error("Users not founded", { cause: 404 }));
  }
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Users is get Sucessfully",
    data: users,
  });
};

export const updateProfile = async (req, res, next) => {
  const { firstName, lastName, password } = req.body;

  if (!(await compare({ planText: password, hash: req.user.password }))) {
    return next(new Error("Invalid password ", { cause: 401 }));
  }
  const user = await dbService.findByIdAndUpdate({
    model: userModel,
    id: req.decoded.id,
    data: {
      firstName,
      lastName,
      password: await hash({ planText: password }),
    },
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User profile updated successfully",
    data: user,
  });
};

import userModel from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { asymmtrecDecrypt } from "../../Utils/Encryption/encryption.utils.js";
import { SuccessResponse } from "../../Utils/Errors/SuccessResponse.utils.js";
import { compare, hash } from "../../Utils/Hashing/hash.utils.js";
import { cloudinaryConfig } from "../../Utils/Multer/cloudinaryConfig.js";

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

export const profileImage = async (req, res, next) => {
  const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    { folder: `Sara7a_app/Users/${req.user._id}` }
  );

  const cloudinary = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      cloudProfileImage: { public_id, secure_url },
    },
  });

  //  const user = await dbService.findOneAndUpdate({
  //    model: userModel,
  //    filter: { _id: req.user._id },
  //    data: {
  //      profileImage: req.file.finalPath,
  //    },
  //  });
  //Destroy
  if (req.user.cloudProfileImage?.public_id) {
    await cloudinaryConfig().uploader.destroy(
      req.user.cloudProfileImage.public_id
    );
  }
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "User profile updated successfully",
    data: { cloudinary },
  });
};

export const coverImage = async (req, res, next) => {
  const attachment = [];
  for (const file of req.files) {
    const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
      file.path,
      { folder: `Sara7a_app/Users/${req.user._id}` }
    );
    attachment.push({ public_id, secure_url });
  }
  const cloudinaryCover = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      cloudCoverImages: attachment,
    },
  });
  // const user = await dbService.findOneAndUpdate({
  //   model: userModel,
  //   filter: { _id: req.user._id },
  //   data: {
  //     coverImage: req.files.map((file) => {
  //       file.finalPath;
  //     }),
  //   },
  // });

  if (req.user.cloudProfileImage?.public_id) {
    await cloudinaryConfig().uploader.destroy(
      req.user.cloudCoverImages.public_id
    );
  }
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Cover image updated successfully",
    data: { cloudinaryCover },
  });
};

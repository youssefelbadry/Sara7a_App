import userModel, { roleEnum } from "../../DB/Models/user.model.js";
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

export const freezeAcount = async (req, res, next) => {
  const { userId } = req.params;
  let freezeUser;

  if (req.decoded.role === roleEnum.USER) {
    if (userId) {
      return next(new Error("you are not admin"));
    }
    freezeUser = req.decoded.id;
  }

  if (req.user.role === roleEnum.ADMIN) {
    if (!userId) {
      return next(new Error("UserId is required"));
    }
    if (req.user._id.toString() === userId) {
      return next(new Error("Admin can not freeze"));
    }
    freezeUser = userId;
  }

  const updateUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: freezeUser,
      freezeAt: { $exists: false },
    },
    data: {
      $unset: {
        restoreAt: true,
        restoreBy: true,
      },
      freezeAt: Date.now(),
      freezeBy: req.user._id,
    },
  });

  return updateUser
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "User profile freezed successfully",
        data: { updateUser },
      })
    : next(new Error("Invalid account"));
};

export const restoreAccount = async (req, res, next) => {
  const { userId } = req.params;
  let restoreUser;

  if (req.decoded.role === roleEnum.USER) {
    if (userId) {
      return next(new Error("You are not admin"));
    }

    const self = req.user;
    if (
      !self.freezeBy ||
      self.freezeBy.toString() !== req.user._id.toString()
    ) {
      return next(new Error("You are not allowed to restore this account"));
    }
    restoreUser = req.user._id;
  }
  //==========================
  else if (req.decoded.role === roleEnum.ADMIN) {
    if (!userId) {
      return next(new Error("Admin must provide userId"));
    }

    if (req.decoded.id.toString() === userId) {
      return next(new Error("Admin cannot restore his own account"));
    }
    const target = await dbService.findById({ model: userModel, id: userId });
    if (!target) return next(new Error("User not found"));

    if (
      !target.freezeBy ||
      target.freezeBy.toString() !== req.user._id.toString()
    ) {
      return next(new Error("You are not allowed to restore this account"));
    }
    restoreUser = userId;
  }

  const updateUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: restoreUser,
      freezeAt: { $exists: true },
    },
    data: {
      $unset: {
        freezeAt: true,
        freezeBy: true,
      },
      restoreAt: Date.now(),
      restoreBy: req.user._id,
    },
  });

  return updateUser
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "User profile restored successfully",
        data: { updateUser },
      })
    : next(new Error("Invalid account"));
};
export const softDelete = async (req, res, next) => {
  const { userId } = req.params;

  const user = await dbService.findById({ model: userModel, id: userId });
  if (!user) return next(new Error("User not founded"));

  if (req.decoded.id !== userId)
    return next(new Error("You are not allowed  to delte this account"));

  if (user.deletedAt) return next(new Error("this account already deleted"));

  const updated = await dbService.findByIdAndUpdate({
    model: userModel,
    id: userId,
    data: {
      deletedAt: Date.now(),
      deletedBy: req.decoded.id,
    },
  });
  return updated
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "User profile deleted successfully",
        data: { updated },
      })
    : next(new Error("Error to deleted account"));
};

export const restoreSofrDelete = async (req, res, next) => {
  const { userId } = req.params;

  const user = await dbService.findById({ model: userModel, id: userId });
  if (!user) return next(new Error("User not founded"));

  if (!user.deletedAt) return next(new Error("User is not soft deleted"));

  if (user.deletedBy.toString() !== req.decoded.id)
    return next(new Error("You are not allowed to restore this account"));

  const restoreSoft = await dbService.findByIdAndUpdate({
    model: userModel,
    id: userId,
    data: {
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
    },
  });
  return restoreSoft
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "User profile restored successfully",
        data: { restoreSoft },
      })
    : next(new Error("Error to deleted account"));
};

export const hardDelete = async (req, res, next) => {
  const { userId } = req.params;

  const user = await dbService.findById({ model: userModel, id: userId });
  if (!user) return next(new Error("User not founded"));

  if (req.decoded.id.toString() !== userId)
    return next(new Error("You are not allowed to delete this account"));

  if (!user.deletedAt)
    return next(new Error("This account is not soft deleted"));

  const deleted = await dbService.findOneAndDelete({
    model: userModel,
    filter: {
      _id: userId,
    },
  });

  return deleted
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "User hard deleted successfully",
        data: { deleted },
      })
    : next(new Error("Error to deleting account"));
};

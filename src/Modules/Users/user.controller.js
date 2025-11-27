import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import { localFileUploud } from "../../Utils/Multer/local.multer.util.js";
import { filterFileTypes } from "../../Utils/Multer/typesOfFiles.multer.js";
import {
  magicNumberValidation,
  magicNumberValidationMultiple,
} from "../../Utils/Multer/magicNumber.multer.js";
import {
  coverImageShcema,
  freezeAccountSchema,
  profileImageShcema,
  restoreAccountSchema,
} from "./user.validation.js";
import { validation } from "../../Middlewares/validate.middleware.js";
import { cloudinaryMulterConfig } from "../../Utils/Multer/cloudinary.multer.js";
import { roleEnum } from "../../DB/Models/user.model.js";

const router = Router();

router.get("/getAll", userService.getAll);
router.patch(
  "/updateProfile",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER] }),
  userService.updateProfile
);
router.patch(
  "/profile-image",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER] }),
  // localFileUploud({ customPath: "User" }).single("profileImage"),
  cloudinaryMulterConfig().single("profileImage"),
  magicNumberValidation({
    typeValidation: [...filterFileTypes.images],
  }),
  // validation(profileImageShcema),
  userService.profileImage
);
router.patch(
  "/cover-image",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER] }),
  // localFileUploud({ customPath: "User" }).array("coverimage", 4),
  cloudinaryMulterConfig().array("coverimage", 4),
  magicNumberValidationMultiple({
    typeValidation: [...filterFileTypes.images],
  }),
  // validation(coverImageShcema),

  userService.coverImage
);

router.delete(
  "{/:userId}/freeze-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(freezeAccountSchema),
  userService.freezeAcount
);
router.patch(
  "{/:userId}/restore-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  validation(freezeAccountSchema),
  userService.restoreAccount
);
router.patch(
  "/softDelete-account/:userId",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  userService.softDelete
);
router.patch(
  "/restore-softDelete/:userId",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  userService.restoreSofrDelete
);
router.patch(
  "/hardDelete/:userId",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
  userService.hardDelete
);

export default router;

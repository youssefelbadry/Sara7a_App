import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const cloudinaryMulterConfig = () =>
  // {
  //     validation = [],
  // }
  {
    const storage = multer.diskStorage({});

    // const fileFilter = (req, file, cb) => {
    //   if (validation.includes(file.mimetype)) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error("Invalid type file"), false);
    //   }
    // };
    return multer({ storage });
  };

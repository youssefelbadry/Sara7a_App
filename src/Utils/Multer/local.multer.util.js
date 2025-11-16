import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const localFileUploud = ({
  customPath = "general",
  validation = [],
}) => {
  const basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`;
      const fullPath = path.resolve(`./src/${userBasePath}`);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`;
      cb(null, uniqueSuffix);
    },
  });

  // const fileFilter = (req, file, cb) => {
  //   if (validation.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Invalid type file"), false);
  //   }
  // };
  return multer({ storage });
};

import multer from "multer";
import path from "node:path";

export const localFileUploud = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve("./src/uploud"));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  return multer({ storage });
};

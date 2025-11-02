import multer from "multer";
import path from "node:path";

export const localFileUploud = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve("./src/uploud"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9 + file.originalname);
      cb(null, uniqueSuffix);
    },
  });
  return multer({ storage });
};

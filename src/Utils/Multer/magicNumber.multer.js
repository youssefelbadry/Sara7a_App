import fs from "node:fs";
import { fileTypeFromBuffer } from "file-type";

export const magicNumberValidation = ({ typeValidation = [] }) => {
  return async (req, res, next) => {
    try {
      if (!req.file) return next(new Error("No file uploaded"));

      const buffer = fs.readFileSync(req.file.path);
      const type = await fileTypeFromBuffer(buffer);

      if (!type || !typeValidation.includes(type.mime)) {
        fs.unlinkSync(req.file.path);
        return next(new Error("Invalid file type"));
      }
      return next();
    } catch (error) {
      return next(new Error("Server Error"));
    }
  };
};

export const magicNumberValidationMultiple = ({ typeValidation = [] }) => {
  return async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return next(new Error("No files uploaded"));
      }
      for (const file of req.files) {
        const buffer = fs.readFileSync(file.path);
        const type = await fileTypeFromBuffer(buffer);

        if (!type || !typeValidation.includes(type.mime)) {
          fs.unlinkSync(file.path);
          return next(new Error("Invalid file type"));
        }
      }

      return next();
    } catch {
      next(new Error("Server Error"));
    }
  };
};

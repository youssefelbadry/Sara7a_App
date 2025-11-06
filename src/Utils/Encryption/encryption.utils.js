import crypto from "node:crypto";
import fs from "node:fs";
import { type } from "node:os";
import { format } from "node:path";
const Encrypted_Secret_Key = Buffer.from(
  JSON.toString(process.env.ENCREPTION_KEY)
);
const IV_Length = Number(process.env.IV);

export const encrypt = (plainText) => {
  const iv = crypto.randomBytes(IV_Length);
  const cipher = crypto.createCipheriv("aes-256-cbc", Encrypted_Secret_Key, iv);

  let encrypted = cipher.update(plainText, "utf-8", "hex");

  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (decryptedData) => {
  const [ivHex, cipherText] = decryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Encrypted_Secret_Key,
    iv
  );

  let decrypted = decipher.update(cipherText, "hex", "utf8");

  decrypted += decipher.final("utf8");
  return decrypted;
};

// =================================================================================
// Assemetric

if (fs.existsSync("public_key.pem") && fs.existsSync("private_key.pem")) {
  console.log("Key already exsist");
} else {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  fs.writeFileSync("public_key.pem", publicKey);
  fs.writeFileSync("private_key.pem", privateKey);
}
// =======
export const asymmtrecEncrypt = (plainText) => {
  const bufferedText = Buffer.from(plainText, "utf8");

  const encreptedData = crypto.publicEncrypt(
    {
      key: fs.readFileSync("public_key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferedText
  );

  return encreptedData.toString("hex");
};

export const asymmtrecDecrypt = (cipherText) => {
  const bufferedCipherText = Buffer.from(cipherText, "hex");

  const decreptedData = crypto.privateDecrypt(
    {
      key: fs.readFileSync("private_key.pem", "utf8"),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferedCipherText
  );

  return decreptedData.toString("utf8");
};

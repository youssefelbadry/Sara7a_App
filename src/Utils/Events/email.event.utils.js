import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../Emails/email.util.js";
import { template } from "../Emails/generatehtml.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.confirmEmail,
    html: template(data.otp, data.firstName),
  }).catch((err) => {
    console.log(`Error sending confirm email ${err}`);
  });
});
eventEmitter.on("forgetpassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.resetPassword,
    html: template(data.otp, data.firstName, emailSubject.resetPassword),
  }).catch((err) => {
    console.log(`Error sending confirm email ${err}`);
  });
});

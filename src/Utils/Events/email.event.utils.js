import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../Emails/email.util.js";
import { template } from "../Emails/generatehtml.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.confirmEmail,
    html: template(data.otp, data.firstName, emailSubject.confirmEmail),
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
eventEmitter.on("2FA-Login-OTP", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      subject: emailSubject.twoFA,
      html: template(data.otp, data.firstName, emailSubject.twoFA),
    });
  } catch (err) {
    console.log(`Error sending 2FA login email: ${err}`);
  }
});

import nodemailer from "nodemailer";

export async function sendEmail({
  to = "",
  subject = "",
  text = "",
  attachments = [],
  html = "",
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASSWORD_USER,
    },
  });

  const info = await transporter.sendMail({
    from: `"Route Academy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });

  console.log("Message sent:", info.messageId);
}

export const emailSubject = {
  confirmEmail: "Confirm Your Email",
  twoFA: "Verify Your Login",
  resetPassword: "Reset Your Password",
  welcome: "Welcome To Rout Academy",
};

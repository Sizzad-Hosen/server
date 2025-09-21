import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // always true for 465
      auth: {
        user: config.email_user,
        pass: config.email_pass, // Gmail App Password (not your login password!)
      },
    });

    const info = await transporter.sendMail({
      from: `"Clickei Bazar" <${config.email_user}>`,
      to,
      subject,
      text: text || "", // fallback
      html,
    });

    if (config.NODE_ENV !== "production") {
      console.log("📧 Email sent:", info.messageId);
    }

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

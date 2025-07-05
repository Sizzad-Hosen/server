import nodemailer from "nodemailer";
import config from "../config";


export const sendEmail = async (to: string, html: string) => {
  try {

    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: config.email_user, 
        pass: config.email_pass,
      },
    });

    await transporter.sendMail({
      from: `"Sizzad Hosen" <${config.email_user}>`, 
      to, 
      subject: "Please change your password", 
      text: "Hello world?", 
      html, 
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

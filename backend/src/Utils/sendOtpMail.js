import nodemailer from "nodemailer";

const sendMailOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hospital xyz <${process.env.USER_MAIL}>"`,
    to: `${email}`,
    subject: "Your OTP code",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f6f6;">
      <div style="max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
  
        <h2 style="text-align: center; color: #2C73D2;">Hospital XYZ</h2>
  
        <p style="font-size: 16px; color: #333;">
          Hello,
        </p>
  
        <p style="font-size: 15px; color: #555;">
          Your One-Time Password (OTP) for verification is:
        </p>
  
        <div style="text-align: center; margin: 20px 0;">
          <h1 style="font-size: 40px; letter-spacing: 5px; color: #2C73D2; margin: 0;">
            ${otp}
          </h1>
        </div>
  
        <p style="font-size: 15px; color: #777;">
          This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
  
        <p style="font-size: 15px; color: #777;">
          If you did not request this, please ignore this email or contact support immediately.
        </p>
  
        <br />
  
        <p style="font-size: 14px; text-align: center; color: #aaa;">
          © ${new Date().getFullYear()} Hospital XYZ. All rights reserved.
        </p>
      </div>
    </div>
  `,
  });
};

export { sendMailOtp };

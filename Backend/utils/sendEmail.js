import nodemailer from "nodemailer";

//
// !!==================== VerificationEmail ====================!!

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome to Notes App</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

//
// !!==================== Reset-Password_Email ====================!!

export const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    console.log("✅ Reset email sent");
  } catch (error) {
    console.error("❌ Reset email error:", error.message);
  }
};

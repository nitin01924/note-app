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
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    
    <h2 style="color: #111;">Reset your password</h2>

    <p>Hi,</p>

    <p>
      We received a request to reset your password for your <b>Notes App</b> account.
    </p>

    <p>
      Click the button below to reset your password:
    </p>

    <a href="${resetLink}" 
       style="
         display: inline-block;
         padding: 10px 16px;
         background-color: #2563eb;
         color: #fff;
         text-decoration: none;
         border-radius: 6px;
         margin-top: 10px;
       ">
       Reset Password
    </a>

    <p style="margin-top: 20px;">
      This link will expire in <b>10 minutes</b>.
    </p>

    <p style="margin-top: 10px;">
      If you didn’t request this, you can safely ignore this email.
    </p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 12px; color: #777;">
      — Notes App Team
    </p>

  </div>
`,
    });

    console.log("✅ Reset email sent");
  } catch (error) {
    console.error("❌ Reset email error:", error.message);
  }
};

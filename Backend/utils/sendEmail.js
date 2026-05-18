import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//
// !!==================== Verification Email ====================!!
//

export const sendVerificationEmail = async (email, token) => {
  try {
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
console.log(process.env.BREVO_API_KEY);
    console.log("📨 Sending verification email...");

    await apiInstance.sendTransacEmail({
      sender: {
        name: "Notes App",
        email: "notesapp.system@gmail.com",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Verify your email",

      htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        
        <h2 style="color: #111;">Verify your email</h2>

        <p>Hi,</p>

        <p>
          Welcome to <b>Notes App</b> 🧧
        </p>

        <p>
          Please confirm your email address to activate your account.
        </p>

        <a href="${verifyLink}" 
          style="
            display: inline-block;
            padding: 10px 16px;
            background-color: #16a34a;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 10px;
          ">
          Verify Email
        </a>

        <p style="margin-top: 20px;">
          If you didn’t create this account, you can safely ignore this email.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 12px; color: #777;">
          — Notes App Team
        </p>

      </div>
      `,
    });

    console.log("✅ Verification email sent");
  } catch (error) {
    console.error("❌ Verification email error:", error.message);
    throw error;
  }
};

//
// !!==================== Reset Password Email ====================!!
//

export const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    console.log("📨 Sending reset password email...");

    await apiInstance.sendTransacEmail({
      sender: {
        name: "Notes App",
        email: "notesapp.system@gmail.com",
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Reset your password",

      htmlContent: `
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

    console.log("✅ Reset password email sent");
  } catch (error) {
    console.error("❌ Reset password email error:", error.message);
    throw error;
  }
};

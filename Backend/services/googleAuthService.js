import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

export const verifyGoogleIdToken = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google OAuth is not configured");
  }

  // verifyIdToken validates Google's signature, expiry, issuer, and that the
  // token was issued specifically for this app's OAuth client ID (audience).
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // Only trust an email that Google has confirmed belongs to this identity.
  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new Error("Google account email is not verified");
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split("@")[0],
    avatar: payload.picture || null,
  };
};

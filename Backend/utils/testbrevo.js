import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

console.log(client.authentications);
const api = new SibApiV3Sdk.AccountApi();

try {
  const data = await api.getAccount();
  console.log("✅ API WORKING");
  console.log(data);
} catch (err) {
  console.log("❌ API FAILED");
  console.log(err.response?.text || err.message);
}

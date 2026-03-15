import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth",authRoutes )

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 5000;

// STARTING SERVER
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {  
    console.log("Server running");
  });
};

startServer();

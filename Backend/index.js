import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

// STARTING SERVER
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
  });
};

startServer();

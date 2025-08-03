import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  const protocol = NODE_ENV === "production" ? "https" : "http";
  const serverUrl = `${protocol}://${HOST}:${PORT}`;
  console.log(`Server running at ${serverUrl}`);
  console.log(`Health check available at ${serverUrl}/health`);
  console.log(`API endpoint at ${serverUrl}/api`);
});

export default app;

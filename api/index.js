import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
  } catch (err) {
    process.exit(1); // Exit the process with failure
  }
};

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cookieParser());


// Register routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.name === "ValidationError"
      ? Object.values(err.errors)
          .map((value) => value.message)
          .join(" ")
      : err.code === 11000
      ? `${Object.keys(err.keyValue)[0]} already exists`
      : err.message || "An Internal Server Error Occurred";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});


// Start the server and connect to the database
const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

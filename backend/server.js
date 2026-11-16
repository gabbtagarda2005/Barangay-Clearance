const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: `${__dirname}/.env` });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const clearanceRoutes = require("./routes/clearanceRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopmentOrigin =
      process.env.NODE_ENV !== "production" &&
      ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin);

    callback(null, !origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin);
  },
}));
app.use(express.json());
app.use(morgan("combined"));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later",
});

// Static files for uploaded images
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/clearances", clearanceRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured before starting the server");
  }

  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});

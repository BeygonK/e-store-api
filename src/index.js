require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const { apiLimiter } = require("./middleware/rateLimiter");

const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

// Connect to database only if not in test environment
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

module.exports = app;

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

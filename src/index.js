require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
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
app.use(express.json());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "E-Store API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "list",
      filter: true,
      showCommonExtensions: true,
    },
  })
);

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
    console.log(
      `API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}

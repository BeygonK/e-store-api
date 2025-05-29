const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Store API Documentation",
      version: "1.0.0",
      description: "API documentation for the E-Store e-commerce platform",
      contact: {
        name: "API Support",
        email: "support@estore.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://e-store-api-y62k.onrender.com"
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../models/*.js"),
  ], // Using absolute paths
};

const specs = swaggerJsdoc(options);

module.exports = specs;

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const User = require("../../models/User");
const { clearTestDB } = require("../setup");

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    // No need to connectTestDB here
  }, 10000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    // No need to closeConnections here
  }, 10000);

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
    });

    it("should not register user with existing email", async () => {
      // First create a user
      await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      // Try to create another user with same email
      const res = await request(app).post("/api/auth/register").send({
        firstName: "Jane",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "User already exists with this email"
      );
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
      expect(res.body).toHaveProperty("success", false);
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      const registerRes = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      token = registerRes.body.token;
    });

    it("should get current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
    });

    it("should not get current user without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain("Not authorized");
    });

    it("should not get current user with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain("Not authorized");
    });
  });
});

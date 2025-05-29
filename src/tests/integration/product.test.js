const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const { clearTestDB } = require("../setup");
const Product = require("../../models/Product");
const User = require("../../models/User");

describe("Product Endpoints", () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create a test user and get auth token
    testUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    authToken = loginRes.body.token;
  }, 10000);

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    // No need to closeConnections here
  }, 10000);

  describe("GET /api/products", () => {
    beforeEach(async () => {
      // Create some test products
      await Product.create([
        {
          name: "Product 1",
          description: "Description 1",
          price: 99.99,
          category: "Electronics",
          stock: 100,
          createdBy: testUser._id,
        },
        {
          name: "Product 2",
          description: "Description 2",
          price: 149.99,
          category: "Electronics",
          stock: 50,
          createdBy: testUser._id,
        },
      ]);
    });

    it("should get all products", async () => {
      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.products)).toBeTruthy();
      expect(res.body.products.length).toBe(2);
    });

    it("should filter products by category", async () => {
      const res = await request(app)
        .get("/api/products")
        .query({ category: "Electronics" });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.products)).toBeTruthy();
      expect(res.body.products.length).toBe(2);
      expect(res.body.products[0].category).toBe("Electronics");
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "Electronics",
        stock: 100,
      };

      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(res.statusCode).toBe(201);
      expect(res.body.product).toHaveProperty("name", productData.name);
      expect(res.body.product).toHaveProperty("price", productData.price);
    });

    it("should not create product without auth token", async () => {
      const productData = {
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "Electronics",
        stock: 100,
      };

      const res = await request(app).post("/api/products").send(productData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/products/:id", () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "Electronics",
        stock: 100,
        createdBy: testUser._id,
      });
    });

    it("should get product by id", async () => {
      const res = await request(app).get(`/api/products/${testProduct._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.product).toHaveProperty("name", testProduct.name);
      expect(res.body.product).toHaveProperty("price", testProduct.price);
    });

    it("should return 404 for non-existent product", async () => {
      const res = await request(app).get("/api/products/123456789012");

      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /api/products/:id", () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "Electronics",
        stock: 100,
        createdBy: testUser._id,
      });
    });

    it("should update product", async () => {
      const updateData = {
        name: "Updated Product",
        price: 149.99,
      };

      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.product).toHaveProperty("name", updateData.name);
      expect(res.body.product).toHaveProperty("price", updateData.price);
    });

    it("should not update product without auth token", async () => {
      const updateData = {
        name: "Updated Product",
        price: 149.99,
      };

      const res = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .send(updateData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/products/:id", () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        category: "Electronics",
        stock: 100,
        createdBy: testUser._id,
      });
    });

    it("should delete product", async () => {
      const res = await request(app)
        .delete(`/api/products/${testProduct._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);

      // Verify product is deleted
      const deletedProduct = await Product.findById(testProduct._id);
      expect(deletedProduct).toBeNull();
    });

    it("should not delete product without auth token", async () => {
      const res = await request(app).delete(`/api/products/${testProduct._id}`);

      expect(res.statusCode).toBe(401);
    });
  });
});
